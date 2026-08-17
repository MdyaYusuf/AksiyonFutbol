using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;

namespace Api.Features.SeasonTransitions;

public class SeasonTransitionService(
  SeasonTransitionBusinessRules _businessRules,
  IClubRepository _clubRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IFixtureSchedulingService _fixtureSchedulingService,
  IUnitOfWork _unitOfWork,
  IOptions<GameOptions> _gameOptions,
  HybridCache _cache) : ISeasonTransitionService, ICompetitiveSeasonEndService
{
  private const string LeagueCacheTag = "league-divisions";
  private static readonly ConcurrentDictionary<int, SemaphoreSlim> GroupLocks = new();

  public async Task<ReturnModel<SeasonEndPreviewDto>> PreviewByDivisionIdAsync(
    int divisionId,
    string userRole,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision anchor = await _businessRules.GetDivisionAsync(
      divisionId,
      cancellationToken: cancellationToken);

    _businessRules.MustNotBeTutorial(anchor);

    await _businessRules.EnsureCanManageSeasonEndAsync(
      userRole,
      currentUserId,
      anchor.GroupNumber,
      cancellationToken);

    SeasonEndPreviewDto preview = await BuildPreviewAsync(anchor.GroupNumber, cancellationToken);

    return new ReturnModel<SeasonEndPreviewDto>
    {
      Success = true,
      Message = preview.CanProcess
        ? "Sezon sonu önizlemesi hazır."
        : preview.BlockReason ?? "Sezon sonu henüz işlenemez.",
      Data = preview,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<SeasonEndProcessResultDto>> ProcessByDivisionIdAsync(
    int divisionId,
    string userRole,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision anchor = await _businessRules.GetDivisionAsync(
      divisionId,
      cancellationToken: cancellationToken);

    _businessRules.MustNotBeTutorial(anchor);

    await _businessRules.EnsureCanManageSeasonEndAsync(
      userRole,
      currentUserId,
      anchor.GroupNumber,
      cancellationToken: cancellationToken);

    SeasonEndProcessResultDto result = await ApplyGroupAsync(
      anchor.GroupNumber,
      cancellationToken);

    return new ReturnModel<SeasonEndProcessResultDto>
    {
      Success = true,
      Message =
        $"Sezon sonu işlendi. {result.ClubsPromoted} kulüp yükseldi, {result.ClubsRelegated} kulüp düştü. Ligler hafta {result.ResetMatchWeek} konumuna alındı. {result.FixturesGenerated} yeni maç oluşturuldu.",
      Data = result,
      StatusCode = 200
    };
  }

  public async Task TryProcessAfterMatchAsync(
    Match match,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? division = match.Division;

    if (division == null)
    {
      division = await _leagueDivisionRepository.GetByIdAsync(
        match.DivisionId,
        cancellationToken: cancellationToken);
    }

    if (division == null || division.IsTutorial)
    {
      return;
    }

    bool ready = await _businessRules.IsGroupReadyForSeasonEndAsync(
      division.GroupNumber,
      cancellationToken);

    if (!ready)
    {
      return;
    }

    try
    {
      await ApplyGroupAsync(division.GroupNumber, cancellationToken);
    }
    catch (BusinessException)
    {
      // Another worker is processing this group or readiness changed mid-flight.
    }
  }

  public async Task<int> ProcessReadyGroupsAsync(CancellationToken cancellationToken = default)
  {
    List<int> groupNumbers = await _businessRules.GetCompetitiveGroupNumbersAsync(cancellationToken);
    int processed = 0;

    foreach (int groupNumber in groupNumbers)
    {
      cancellationToken.ThrowIfCancellationRequested();

      if (!await _businessRules.IsGroupReadyForSeasonEndAsync(groupNumber, cancellationToken))
      {
        continue;
      }

      try
      {
        await ApplyGroupAsync(groupNumber, cancellationToken);
        processed += 1;
      }
      catch (BusinessException)
      {
        // Another worker or race — skip.
      }
    }

    return processed;
  }

  private async Task<SeasonEndProcessResultDto> ApplyGroupAsync(
    int groupNumber,
    CancellationToken cancellationToken)
  {
    SemaphoreSlim gate = GroupLocks.GetOrAdd(groupNumber, _ => new SemaphoreSlim(1, 1));

    if (!await gate.WaitAsync(0, cancellationToken))
    {
      throw new BusinessException("Bu grup için sezon sonu işlemi zaten devam ediyor.");
    }

    try
    {
      return await ApplyGroupCoreAsync(groupNumber, cancellationToken);
    }
    finally
    {
      gate.Release();
    }
  }

  private async Task<SeasonEndProcessResultDto> ApplyGroupCoreAsync(
    int groupNumber,
    CancellationToken cancellationToken)
  {
    SeasonEndPreviewDto preview = await BuildPreviewAsync(groupNumber, cancellationToken);

    if (!preview.CanProcess)
    {
      throw new BusinessException(preview.BlockReason ?? "Sezon sonu işlenemez.");
    }

    List<LeagueDivision> ladder = await _businessRules.GetGroupLadderAsync(
      groupNumber,
      enableTracking: true,
      cancellationToken: cancellationToken);

    Dictionary<Guid, Club> clubsById = new();

    foreach (LeagueDivision division in ladder)
    {
      List<Club> clubs = await _businessRules.GetClubsForDivisionAsync(
        division.Id,
        enableTracking: true,
        cancellationToken: cancellationToken);

      foreach (Club club in clubs)
      {
        clubsById[club.Id] = club;
      }
    }

    List<SeasonClubMovementDto> appliedMovements = preview.Movements
      .Where(m => m.Outcome is SeasonMovementOutcome.Promoted or SeasonMovementOutcome.Relegated)
      .ToList();

    foreach (SeasonClubMovementDto movement in appliedMovements)
    {
      if (!movement.ToDivisionId.HasValue)
      {
        continue;
      }

      if (!clubsById.TryGetValue(movement.ClubId, out Club? club))
      {
        throw new NotFoundException($"{movement.ClubName} kulübü bulunamadı.");
      }

      club.DivisionId = movement.ToDivisionId.Value;
      club.UpdatedDate = DateTime.UtcNow;
      _clubRepository.Update(club);
    }

    await ResetSeasonStatsForClubsAsync(clubsById.Keys, cancellationToken);

    int resetWeek = _businessRules.Options.MinimumMatchWeek;
    GameOptions options = _gameOptions.Value;
    int fixturesGenerated = 0;

    DateTime firstKickoffLocal = GameLocalClock.GetNextKickoffLocal(
      DateTime.UtcNow,
      options.MatchKickoffLocalTime);

    Dictionary<int, List<Club>> clubsByNewDivisionId = ladder.ToDictionary(
      division => division.Id,
      _ => new List<Club>());

    foreach (Club club in clubsById.Values)
    {
      if (!club.DivisionId.HasValue)
      {
        continue;
      }

      if (clubsByNewDivisionId.TryGetValue(club.DivisionId.Value, out List<Club>? divisionClubs))
      {
        divisionClubs.Add(club);
      }
    }

    foreach (LeagueDivision division in ladder)
    {
      division.CurrentSeason += 1;
      division.CurrentMatchWeek = resetWeek;
      division.UpdatedDate = DateTime.UtcNow;
      _leagueDivisionRepository.Update(division);

      List<Club> clubs = clubsByNewDivisionId[division.Id];

      if (clubs.Count < 2 || clubs.Count % 2 != 0)
      {
        throw new BusinessException(
          $"{division.Name} fikstürü için çift sayıda kulüp gerekir (mevcut: {clubs.Count}).");
      }

      List<Guid> orderedClubIds = clubs
        .OrderBy(c => c.Name, StringComparer.OrdinalIgnoreCase)
        .Select(c => c.Id)
        .ToList();

      int created = await _fixtureSchedulingService.ScheduleDoubleRoundRobinAsync(
        division.Id,
        orderedClubIds,
        options.CompetitiveMatchWeeks,
        division.CurrentSeason,
        firstKickoffLocal: firstKickoffLocal,
        cancellationToken: cancellationToken);

      fixturesGenerated += created;
    }

    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(LeagueCacheTag, cancellationToken);

    int promoted = appliedMovements.Count(m => m.Outcome == SeasonMovementOutcome.Promoted);
    int relegated = appliedMovements.Count(m => m.Outcome == SeasonMovementOutcome.Relegated);

    return new SeasonEndProcessResultDto
    {
      GroupNumber = groupNumber,
      ClubsPromoted = promoted,
      ClubsRelegated = relegated,
      DivisionsReset = ladder.Count,
      ResetMatchWeek = resetWeek,
      FixturesGenerated = fixturesGenerated,
      Movements = appliedMovements
    };
  }

  private async Task<SeasonEndPreviewDto> BuildPreviewAsync(
    int groupNumber,
    CancellationToken cancellationToken)
  {
    List<LeagueDivision> ladder = await _businessRules.GetGroupLadderAsync(
      groupNumber,
      cancellationToken: cancellationToken);

    var divisionPreviews = new List<SeasonDivisionPreviewDto>();
    var standingsByDivisionId = new Dictionary<int, IReadOnlyList<StandingRowDto>>();
    var clubsByDivisionId = new Dictionary<int, List<Club>>();
    var incompleteReasons = new List<string>();

    foreach (LeagueDivision division in ladder)
    {
      bool isComplete = true;

      try
      {
        await _businessRules.EnsureDivisionSeasonCompleteAsync(division, cancellationToken);
      }
      catch (BusinessException ex)
      {
        isComplete = false;
        incompleteReasons.Add(ex.Message);
      }

      List<Club> clubs = await _businessRules.GetClubsForDivisionAsync(
        division.Id,
        cancellationToken: cancellationToken);
      clubsByDivisionId[division.Id] = clubs;

      List<Match> matches = await _businessRules.GetPlayedMatchesForDivisionAsync(
        division.Id,
        division.CurrentSeason,
        cancellationToken);

      IReadOnlyList<StandingRowDto> standings = SeasonStandingsCalculator.BuildStandings(
        clubs,
        matches,
        division.Id);
      standingsByDivisionId[division.Id] = standings;

      divisionPreviews.Add(new SeasonDivisionPreviewDto
      {
        DivisionId = division.Id,
        DivisionName = division.Name,
        Tier = division.Tier,
        GroupNumber = division.GroupNumber,
        CurrentMatchWeek = division.CurrentMatchWeek,
        CurrentSeason = division.CurrentSeason,
        IsSeasonComplete = isComplete,
        Standings = standings
      });
    }

    bool canProcess = incompleteReasons.Count == 0;
    string? blockReason = incompleteReasons.FirstOrDefault();

    if (ladder.Count < 2)
    {
      canProcess = false;
      blockReason = "Yükselme/düşme için aynı grupta en az iki rekabetçi lig seviyesi gerekir.";
    }

    int swapSlotsConfigured = Math.Min(
      _businessRules.Options.PromotionSlots,
      _businessRules.Options.RelegationSlots);

    var movements = new List<SeasonClubMovementDto>();
    var projectedCounts = ladder.ToDictionary(d => d.Id, d => clubsByDivisionId[d.Id].Count);

    for (int i = 0; i < ladder.Count - 1; i++)
    {
      LeagueDivision higher = ladder[i];
      LeagueDivision lower = ladder[i + 1];

      IReadOnlyList<StandingRowDto> higherStandings = standingsByDivisionId[higher.Id];
      IReadOnlyList<StandingRowDto> lowerStandings = standingsByDivisionId[lower.Id];

      int swapSlots = _businessRules.ResolveSwapSlots(
        higherStandings.Count,
        lowerStandings.Count);

      if (swapSlots == 0)
      {
        continue;
      }

      foreach (StandingRowDto row in higherStandings.TakeLast(swapSlots))
      {
        movements.Add(CreateMovement(row, higher, lower, SeasonMovementOutcome.Relegated));
        projectedCounts[higher.Id] -= 1;
        projectedCounts[lower.Id] += 1;
      }

      foreach (StandingRowDto row in lowerStandings.Take(swapSlots))
      {
        movements.Add(CreateMovement(row, lower, higher, SeasonMovementOutcome.Promoted));
        projectedCounts[lower.Id] -= 1;
        projectedCounts[higher.Id] += 1;
      }
    }

    HashSet<Guid> movingClubIds = movements.Select(m => m.ClubId).ToHashSet();

    foreach (LeagueDivision division in ladder)
    {
      foreach (StandingRowDto row in standingsByDivisionId[division.Id])
      {
        if (movingClubIds.Contains(row.ClubId))
        {
          continue;
        }

        movements.Add(new SeasonClubMovementDto
        {
          ClubId = row.ClubId,
          ClubName = row.ClubName,
          Position = row.Position,
          Points = row.Points,
          FromDivisionId = division.Id,
          FromDivisionName = division.Name,
          FromTier = division.Tier,
          ToDivisionId = division.Id,
          ToDivisionName = division.Name,
          ToTier = division.Tier,
          Outcome = SeasonMovementOutcome.Stayed
        });
      }
    }

    if (canProcess)
    {
      try
      {
        _businessRules.EnsureProjectedCapacity(projectedCounts);
      }
      catch (BusinessException ex)
      {
        canProcess = false;
        blockReason = ex.Message;
      }
    }

    return new SeasonEndPreviewDto
    {
      GroupNumber = groupNumber,
      PromotionSlots = _businessRules.Options.PromotionSlots,
      RelegationSlots = _businessRules.Options.RelegationSlots,
      SwapSlots = swapSlotsConfigured,
      CanProcess = canProcess,
      BlockReason = canProcess ? null : blockReason,
      Divisions = divisionPreviews,
      Movements = movements
        .OrderBy(m => m.FromTier)
        .ThenBy(m => m.Outcome)
        .ThenBy(m => m.Position)
        .ToList()
    };
  }

  private async Task ResetSeasonStatsForClubsAsync(
    IEnumerable<Guid> clubIds,
    CancellationToken cancellationToken)
  {
    List<Guid> clubIdList = clubIds.ToList();

    if (clubIdList.Count == 0)
    {
      return;
    }

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: p => clubIdList.Contains(p.ClubId),
      enableTracking: true,
      cancellationToken: cancellationToken);

    foreach (PlayerInstance player in players)
    {
      player.SeasonGoals = 0;
      player.SeasonAssists = 0;
      player.SeasonYellowCards = 0;
      player.SeasonRedCards = 0;
      player.UpdatedDate = DateTime.UtcNow;
      _playerInstanceRepository.Update(player);
    }
  }

  private static SeasonClubMovementDto CreateMovement(
    StandingRowDto row,
    LeagueDivision from,
    LeagueDivision to,
    SeasonMovementOutcome outcome)
  {
    return new SeasonClubMovementDto
    {
      ClubId = row.ClubId,
      ClubName = row.ClubName,
      Position = row.Position,
      Points = row.Points,
      FromDivisionId = from.Id,
      FromDivisionName = from.Name,
      FromTier = from.Tier,
      ToDivisionId = to.Id,
      ToDivisionName = to.Name,
      ToTier = to.Tier,
      Outcome = outcome
    };
  }
}
