using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.BaseBotClubs;
using Api.Features.BasePlayers;
using Api.Features.ClubDrafts;
using Api.Features.ClubLineups;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Microsoft.Extensions.Options;

namespace Api.Features.CompetitiveSeating;

public class CompetitiveSeatingService(
  IClubRepository _clubRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IBaseBotClubRepository _baseBotClubRepository,
  IBasePlayerRepository _basePlayerRepository,
  IClubLineupRepository _clubLineupRepository,
  IDefaultClubLineupService _defaultClubLineupService,
  IFixtureSchedulingService _fixtureSchedulingService,
  IUnitOfWork _unitOfWork,
  IOptions<GameOptions> _gameOptions) : ICompetitiveSeatingService
{
  public async Task<ReturnModel<CompetitiveSeatingQueuePreviewDto>> GetQueuePreviewAsync(
    CancellationToken cancellationToken = default)
  {
    List<Club> queuedClubs = await _clubRepository.GetAllAsync(
      filter: c => c.LifecycleStatus == ClubLifecycleStatus.AwaitingPlacement,
      cancellationToken: cancellationToken);

    List<CompetitiveSeatingQueueTierDto> byTier = Enum.GetValues<LeagueTier>()
      .OrderBy(t => (int)t)
      .Select(tier => new CompetitiveSeatingQueueTierDto
      {
        Tier = tier,
        ClubCount = queuedClubs.Count(c => c.PlacementTargetTier == tier)
      })
      .Where(x => x.ClubCount > 0)
      .ToList();

    return new ReturnModel<CompetitiveSeatingQueuePreviewDto>
    {
      Success = true,
      StatusCode = StatusCodes.Status200OK,
      Data = new CompetitiveSeatingQueuePreviewDto
      {
        TotalQueuedClubs = queuedClubs.Count,
        ByTier = byTier
      }
    };
  }

  public async Task<ReturnModel<CompetitiveSeatingRunResultDto>> RunSeatingAsync(
    CancellationToken cancellationToken = default)
  {
    List<Club> queuedClubs = await _clubRepository.GetAllAsync(
      filter: c => c.LifecycleStatus == ClubLifecycleStatus.AwaitingPlacement,
      cancellationToken: cancellationToken);

    int clubsQueued = queuedClubs.Count;

    if (clubsQueued == 0)
    {
      return new ReturnModel<CompetitiveSeatingRunResultDto>
      {
        Success = true,
        StatusCode = StatusCodes.Status200OK,
        Message = "Bekleyen kulüp yok.",
        Data = new CompetitiveSeatingRunResultDto
        {
          DivisionsCreated = 0,
          ClubsSeated = 0
        }
      };
    }

    int divisionsCreated = await SeatQueuedClubsAsync(cancellationToken);

    return new ReturnModel<CompetitiveSeatingRunResultDto>
    {
      Success = true,
      StatusCode = StatusCodes.Status200OK,
      Message = $"{divisionsCreated} rekabetçi lig oluşturuldu, {clubsQueued} kulüp yerleştirildi.",
      Data = new CompetitiveSeatingRunResultDto
      {
        DivisionsCreated = divisionsCreated,
        ClubsSeated = clubsQueued
      }
    };
  }

  public async Task<int> SeatQueuedClubsAsync(CancellationToken cancellationToken = default)
  {
    GameOptions options = _gameOptions.Value;
    int capacity = options.MaximumClubsPerDivision;
    int divisionsCreated = 0;

    foreach (LeagueTier tier in Enum.GetValues<LeagueTier>().OrderBy(t => (int)t))
    {
      List<Club> queue = await _clubRepository.GetAllAsync(
        filter: c =>
          c.LifecycleStatus == ClubLifecycleStatus.AwaitingPlacement
          && c.PlacementTargetTier == tier,
        orderBy: query => query.OrderBy(c => c.CreatedDate).ThenBy(c => c.Id),
        enableTracking: true,
        cancellationToken: cancellationToken);

      while (queue.Count > 0)
      {
        List<Club> batch = queue.Take(capacity).ToList();
        queue = queue.Skip(capacity).ToList();

        await SeatBatchAsync(tier, batch, options, cancellationToken);
        divisionsCreated += 1;
      }
    }

    if (divisionsCreated > 0)
    {
      await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    return divisionsCreated;
  }

  private async Task SeatBatchAsync(
    LeagueTier tier,
    List<Club> humanClubs,
    GameOptions options,
    CancellationToken cancellationToken)
  {
    int capacity = options.MaximumClubsPerDivision;
    int botsNeeded = capacity - humanClubs.Count;

    if (botsNeeded < 0)
    {
      throw new BusinessException("Seating batch kulüp kapasitesini aşıyor.");
    }

    int nextGroup = await ResolveNextGroupNumberAsync(tier, cancellationToken);
    string divisionName = $"{tier} Group {nextGroup}";

    bool nameUnique = await _leagueDivisionRepository.IsNameUniqueAsync(
      divisionName,
      cancellationToken: cancellationToken);

    if (!nameUnique)
    {
      divisionName = $"{divisionName} {DateTime.UtcNow:yyyyMMddHHmmss}";
    }

    LeagueDivision division = new()
    {
      Name = divisionName,
      Tier = (int)tier,
      GroupNumber = nextGroup,
      CurrentMatchWeek = options.MinimumMatchWeek,
      CurrentSeason = 1,
      IsTutorial = false,
      OwnerUserId = null,
      LifecycleStatus = DivisionLifecycleStatus.Active
    };

    await _leagueDivisionRepository.AddAsync(division, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    decimal seatingBonus = TutorialGraduationBusinessRules.GetSeatingBonus(tier, options);
    decimal wageFloor = TutorialGraduationBusinessRules.GetTierStartingWageBudget(tier, options);

    List<Club> seatedClubs = [];

    foreach (Club human in humanClubs)
    {
      human.Cash += seatingBonus;
      human.WageBudget = Math.Max(human.WageBudget, wageFloor);
      human.Division = division;
      human.LifecycleStatus = ClubLifecycleStatus.Competitive;
      human.PlacementTargetTier = null;
      _clubRepository.Update(human);
      seatedClubs.Add(human);
    }

    List<BaseBotClub> botTemplates = await LoadDistinctCompetitiveBotTemplatesAsync(
      botsNeeded,
      humanClubs,
      cancellationToken);

    List<BasePlayer> catalog = await _basePlayerRepository.GetAllAsync(
      cancellationToken: cancellationToken);

    BotDraftProfileKind botProfile = BotDraftProfileResolver.FromLeagueTier(tier);

    List<(Club Bot, BaseBotClub Template)> seatedBots = [];

    foreach (BaseBotClub template in botTemplates)
    {
      (string instanceName, string displayName) = BotClubInstanceNaming.FromTemplate(template.Name);

      Club botClub = new()
      {
        Name = instanceName,
        DisplayName = displayName,
        IsBot = true,
        PresidentId = null,
        Division = division,
        LifecycleStatus = ClubLifecycleStatus.Competitive,
        PlacementTargetTier = null,
        Cash = options.DraftStartingCash,
        WageBudget = wageFloor,
        Morale = template.StartingMorale,
        Chemistry = template.StartingChemistry,
        Discipline = template.StartingDiscipline,
        Suspicion = options.StartingSuspicion
      };

      await _clubRepository.AddAsync(botClub, cancellationToken);

      BotDraftStyle botStyle = BotDraftStylePicker.Roll(options.BotDraft.CompetitiveStyleWeights);

      List<BasePlayer> picks = BotSquadAutoDraft.SelectSquad(
        catalog,
        options,
        botClub.Cash,
        botClub.WageBudget,
        botProfile,
        botStyle);

      foreach (BasePlayer pick in picks)
      {
        botClub.Cash -= pick.DraftFee;
        botClub.Players.Add(
          PlayerInstanceFromBasePlayer.CreateFromTemplate(botClub.Id, pick));
      }

      seatedBots.Add((botClub, template));
      seatedClubs.Add(botClub);
    }

    await _unitOfWork.SaveChangesAsync(cancellationToken);

    foreach (Club club in seatedClubs)
    {
      await _defaultClubLineupService.EnsureAsync(club.Id, cancellationToken);
    }

    foreach ((Club bot, BaseBotClub template) in seatedBots)
    {
      if (template.PreferredFormation == null)
      {
        continue;
      }

      ClubLineup? lineup = await _clubLineupRepository.GetAsync(
        l => l.ClubId == bot.Id,
        enableTracking: true,
        cancellationToken: cancellationToken);

      if (lineup == null)
      {
        continue;
      }

      lineup.Formation = template.PreferredFormation.Value;
    }

    DateTime localNow = GameLocalClock.ConvertUtcToLocal(DateTime.UtcNow);
    DateTime firstKickoffLocal = DateTime.SpecifyKind(
      localNow.Date + options.MatchKickoffLocalTime,
      DateTimeKind.Unspecified);

    List<Guid> orderedIds = seatedClubs.Select(c => c.Id).ToList();

    await _fixtureSchedulingService.ScheduleDoubleRoundRobinAsync(
      division.Id,
      orderedIds,
      options.CompetitiveMatchWeeks,
      division.CurrentSeason,
      firstKickoffLocal: firstKickoffLocal,
      cancellationToken: cancellationToken);
  }

  private async Task<int> ResolveNextGroupNumberAsync(
    LeagueTier tier,
    CancellationToken cancellationToken)
  {
    List<LeagueDivision> existing = await _leagueDivisionRepository.GetAllAsync(
      filter: d => !d.IsTutorial && d.Tier == (int)tier,
      cancellationToken: cancellationToken);

    if (existing.Count == 0)
    {
      return 1;
    }

    return existing.Max(d => d.GroupNumber) + 1;
  }

  private async Task<List<BaseBotClub>> LoadDistinctCompetitiveBotTemplatesAsync(
    int count,
    IReadOnlyList<Club> humanClubsInBatch,
    CancellationToken cancellationToken)
  {
    if (count == 0)
    {
      return [];
    }

    List<BaseBotClub> templates = await _baseBotClubRepository.GetAllAsync(
      filter: b => !b.IsTutorialTemplate,
      orderBy: query => query.OrderBy(b => b.Name),
      cancellationToken: cancellationToken);

    HashSet<string> reservedDisplayNames = humanClubsInBatch
      .Select(c => c.DisplayName)
      .Concat(humanClubsInBatch.Select(c => c.Name))
      .ToHashSet(StringComparer.OrdinalIgnoreCase);

    List<BaseBotClub> eligible = templates
      .Where(t => !reservedDisplayNames.Contains(t.Name))
      .ToList();

    for (int i = eligible.Count - 1; i > 0; i--)
    {
      int swapIndex = Random.Shared.Next(i + 1);
      (eligible[i], eligible[swapIndex]) = (eligible[swapIndex], eligible[i]);
    }

    List<BaseBotClub> selected = eligible.Take(count).ToList();

    if (selected.Count < count)
    {
      throw new BusinessException(
        $"Rekabetçi seating için yeterli bot şablonu yok. Gereken: {count}, uygun: {selected.Count}.");
    }

    return selected;
  }
}
