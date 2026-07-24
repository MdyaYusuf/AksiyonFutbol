using Api.Core.Exceptions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Microsoft.Extensions.Caching.Hybrid;

namespace Api.Features.SeasonTransitions;

public class SeasonTransitionService(
  SeasonTransitionBusinessRules _businessRules,
  IClubRepository _clubRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IUnitOfWork _unitOfWork,
  HybridCache _cache) : ISeasonTransitionService
{
  private const string LeagueCacheTag = "league-divisions";

  public async Task<ReturnModel<SeasonEndPreviewDto>> PreviewByDivisionIdAsync(
    int divisionId,
    string userRole,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision anchor = await _businessRules.GetDivisionAsync(
      divisionId,
      cancellationToken: cancellationToken);

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

    await _businessRules.EnsureCanManageSeasonEndAsync(
      userRole,
      currentUserId,
      anchor.GroupNumber,
      cancellationToken);

    SeasonEndPreviewDto preview = await BuildPreviewAsync(anchor.GroupNumber, cancellationToken);

    if (!preview.CanProcess)
    {
      throw new BusinessException(preview.BlockReason ?? "Sezon sonu işlenemez.");
    }

    List<LeagueDivision> ladder = await _businessRules.GetGroupLadderAsync(
      anchor.GroupNumber,
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

    int resetWeek = _businessRules.Options.MinimumMatchWeek;

    foreach (LeagueDivision division in ladder)
    {
      division.CurrentMatchWeek = resetWeek;
      division.UpdatedDate = DateTime.UtcNow;
      _leagueDivisionRepository.Update(division);
    }

    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(LeagueCacheTag, cancellationToken);

    int promoted = appliedMovements.Count(m => m.Outcome == SeasonMovementOutcome.Promoted);
    int relegated = appliedMovements.Count(m => m.Outcome == SeasonMovementOutcome.Relegated);

    return new ReturnModel<SeasonEndProcessResultDto>
    {
      Success = true,
      Message =
        $"Sezon sonu işlendi. {promoted} kulüp yükseldi, {relegated} kulüp düştü. Ligler hafta {resetWeek} konumuna alındı.",
      Data = new SeasonEndProcessResultDto
      {
        GroupNumber = anchor.GroupNumber,
        ClubsPromoted = promoted,
        ClubsRelegated = relegated,
        DivisionsReset = ladder.Count,
        ResetMatchWeek = resetWeek,
        Movements = appliedMovements
      },
      StatusCode = 200
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
        IsSeasonComplete = isComplete,
        Standings = standings
      });
    }

    bool canProcess = incompleteReasons.Count == 0;
    string? blockReason = incompleteReasons.FirstOrDefault();

    if (ladder.Count < 2)
    {
      canProcess = false;
      blockReason = "Yükselme/düşme için aynı grupta en az iki lig seviyesi gerekir.";
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
