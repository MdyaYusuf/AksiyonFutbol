using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.BaseBotClubs;
using Api.Features.BasePlayers;
using Api.Features.ClubLineups;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubDrafts;

public class ClubDraftService(
  ClubDraftBusinessRules _businessRules,
  ClubBusinessRules _clubBusinessRules,
  IBasePlayerRepository _basePlayerRepository,
  IClubDraftPickRepository _draftPickRepository,
  IClubRepository _clubRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IClubLineupRepository _clubLineupRepository,
  IDefaultClubLineupService _defaultClubLineupService,
  IFixtureSchedulingService _fixtureSchedulingService,
  IUnitOfWork _unitOfWork,
  IValidator<AddClubDraftPickRequest> _addPickValidator,
  IOptions<GameOptions> _gameOptions) : IClubDraftService
{
  public async Task<ReturnModel<List<DraftCatalogPlayerDto>>> GetCatalogAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    HashSet<Guid> pickedIds = club.DraftPicks.Select(p => p.BasePlayerId).ToHashSet();

    List<BasePlayer> catalog = await _basePlayerRepository.GetAllAsync(
      orderBy: query => query
        .OrderBy(bp => bp.Position)
        .ThenBy(bp => bp.DraftTier)
        .ThenByDescending(bp => bp.AttackPower + bp.DefenseStrength + bp.MidfieldControl)
        .ThenBy(bp => bp.DefaultLastName)
        .ThenBy(bp => bp.DefaultFirstName),
      cancellationToken: cancellationToken);

    List<DraftCatalogPlayerDto> items = catalog.Select(bp =>
    {
      int overall = BasePlayerRatingCalculator.Calculate(bp);
      return new DraftCatalogPlayerDto
      {
        Id = bp.Id,
        DefaultFirstName = bp.DefaultFirstName,
        DefaultLastName = bp.DefaultLastName,
        Nationality = bp.Nationality,
        Position = bp.Position,
        PreferredFoot = bp.PreferredFoot,
        Age = bp.Age,
        HeightCm = bp.HeightCm,
        WeightKg = bp.WeightKg,
        OverallRating = overall,
        DraftTier = bp.DraftTier,
        DraftFee = bp.DraftFee,
        Wage = bp.Wage,
        IsPickedByMe = pickedIds.Contains(bp.Id),
        IsDraftOnly = bp.IsDraftOnly,
        IsFreeAgentTemplate = bp.IsFreeAgentTemplate
      };
    }).ToList();

    return new ReturnModel<List<DraftCatalogPlayerDto>>()
    {
      Success = true,
      Message = "Draft kataloğu başarılı bir şekilde getirildi.",
      Data = items,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubDraftStateDto>> GetStateAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    return new ReturnModel<ClubDraftStateDto>()
    {
      Success = true,
      Message = "Draft durumu başarılı bir şekilde getirildi.",
      Data = BuildState(club, _gameOptions.Value),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubDraftStateDto>> AddPickAsync(
    AddClubDraftPickRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _addPickValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Club club = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    GameOptions options = _gameOptions.Value;
    BasePlayer basePlayer = await _businessRules.GetBasePlayerIfExistAsync(
      request.BasePlayerId,
      cancellationToken);

    await _businessRules.MustNotAlreadyBePickedAsync(club.Id, basePlayer.Id, cancellationToken);
    _businessRules.MustHavePositionQuotaRemaining(club, basePlayer.Position, options);
    _businessRules.MustAffordPick(club, basePlayer);

    int nextOrder = club.DraftPicks.Count == 0
      ? 1
      : club.DraftPicks.Max(p => p.PickOrder) + 1;

    ClubDraftPick pick = new()
    {
      ClubId = club.Id,
      BasePlayerId = basePlayer.Id,
      PickOrder = nextOrder
    };

    await _draftPickRepository.AddAsync(pick, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    Club refreshed = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    return new ReturnModel<ClubDraftStateDto>()
    {
      Success = true,
      Message = "Oyuncu draft listesine eklendi.",
      Data = BuildState(refreshed, options),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubDraftStateDto>> RemovePickAsync(
    Guid basePlayerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    ClubDraftPick? pick = club.DraftPicks.FirstOrDefault(p => p.BasePlayerId == basePlayerId);

    if (pick == null)
    {
      throw new NotFoundException("Draft listesinde bu oyuncu bulunamadı.");
    }

    _draftPickRepository.Delete(pick);
    club.DraftPicks.Remove(pick);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    Club refreshed = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    return new ReturnModel<ClubDraftStateDto>()
    {
      Success = true,
      Message = "Oyuncu draft listesinden çıkarıldı.",
      Data = BuildState(refreshed, _gameOptions.Value),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<FinalizeClubDraftResponseDto>> FinalizeAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetDraftingClubForUserAsync(
      currentUserId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    GameOptions options = _gameOptions.Value;
    _businessRules.MustMeetExactQuotas(club, options);

    List<BaseBotClub> botTemplates = await _businessRules.GetTutorialBotTemplatesAsync(cancellationToken);

    List<BasePlayer> allTemplates = await _basePlayerRepository.GetAllAsync(
      cancellationToken: cancellationToken);

    HashSet<Guid> takenIds = club.DraftPicks.Select(p => p.BasePlayerId).ToHashSet();
    List<BasePlayer> remainingPool = allTemplates
      .Where(bp => !takenIds.Contains(bp.Id))
      .ToList();

    LeagueDivision tutorial = new()
    {
      Name = BuildTutorialDivisionName(club.Name),
      Tier = (int)LeagueTier.Iron,
      GroupNumber = 0,
      CurrentMatchWeek = options.MinimumMatchWeek,
      CurrentSeason = 1,
      IsTutorial = true,
      OwnerUserId = currentUserId,
      LifecycleStatus = DivisionLifecycleStatus.Active
    };

    bool nameUnique = await _leagueDivisionRepository.IsNameUniqueAsync(
      tutorial.Name,
      cancellationToken: cancellationToken);

    if (!nameUnique)
    {
      tutorial.Name = $"{tutorial.Name} {DateTime.UtcNow:yyyyMMddHHmmss}";
    }

    await _leagueDivisionRepository.AddAsync(tutorial, cancellationToken);

    decimal spentFees = club.DraftPicks.Sum(p => p.BasePlayer.DraftFee);
    club.Cash -= spentFees;
    club.Division = tutorial;
    club.TutorialDivision = tutorial;
    club.LifecycleStatus = ClubLifecycleStatus.Tutorial;

    foreach (ClubDraftPick pick in club.DraftPicks.OrderBy(p => p.PickOrder))
    {
      club.Players.Add(
        PlayerInstanceFromBasePlayer.CreateFromTemplate(club.Id, pick.BasePlayer));
    }

    List<Club> botClubs = [];

    foreach (BaseBotClub template in botTemplates)
    {
      await _clubBusinessRules.ClubNameMustBeUniqueAsync(template.Name, cancellationToken: cancellationToken);

      Club botClub = new()
      {
        Name = template.Name,
        IsBot = true,
        PresidentId = null,
        Division = tutorial,
        TutorialDivision = tutorial,
        LifecycleStatus = ClubLifecycleStatus.Tutorial,
        Cash = options.DraftStartingCash,
        WageBudget = options.DraftWageBudget,
        Morale = template.StartingMorale,
        Chemistry = template.StartingChemistry,
        Discipline = template.StartingDiscipline,
        Suspicion = options.StartingSuspicion
      };

      await _clubRepository.AddAsync(botClub, cancellationToken);

      List<BasePlayer> botPicks = BotSquadAutoDraft.SelectSquad(
        remainingPool,
        options,
        botClub.Cash,
        botClub.WageBudget);

      foreach (BasePlayer pick in botPicks)
      {
        botClub.Cash -= pick.DraftFee;
        botClub.Players.Add(
          PlayerInstanceFromBasePlayer.CreateFromTemplate(botClub.Id, pick));
      }

      botClubs.Add(botClub);
    }

    List<ClubDraftPick> picksToClear = club.DraftPicks.ToList();
    _draftPickRepository.DeleteRange(picksToClear);
    club.DraftPicks.Clear();

    _clubRepository.Update(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    await _defaultClubLineupService.EnsureAsync(club.Id, cancellationToken);

    foreach (Club botClub in botClubs)
    {
      await _defaultClubLineupService.EnsureAsync(botClub.Id, cancellationToken);
      await ApplyPreferredFormationAsync(botClub.Name, botClub.Id, botTemplates, cancellationToken);
    }

    List<Guid> orderedClubIds = new List<Guid> { club.Id }
      .Concat(botClubs.Select(b => b.Id))
      .ToList();

    int matchCount = await _fixtureSchedulingService.ScheduleDoubleRoundRobinAsync(
      tutorial.Id,
      orderedClubIds,
      options.TutorialMatchWeeks,
      tutorial.CurrentSeason,
      cancellationToken: cancellationToken);

    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<FinalizeClubDraftResponseDto>()
    {
      Success = true,
      Message = "Draft tamamlandı. Tutorial ligi ve fikstür oluşturuldu.",
      Data = new FinalizeClubDraftResponseDto
      {
        ClubId = club.Id,
        TutorialDivisionId = tutorial.Id,
        TutorialDivisionName = tutorial.Name,
        LifecycleStatus = club.LifecycleStatus,
        SquadSize = options.StarterSquadGoalkeepers
          + options.StarterSquadDefenders
          + options.StarterSquadMidfielders
          + options.StarterSquadForwards,
        FixturesScheduled = matchCount > 0
      },
      StatusCode = 200
    };
  }

  private async Task ApplyPreferredFormationAsync(
    string botClubName,
    Guid botClubId,
    List<BaseBotClub> templates,
    CancellationToken cancellationToken)
  {
    BaseBotClub? template = templates.FirstOrDefault(t => t.Name == botClubName);

    if (template?.PreferredFormation == null)
    {
      return;
    }

    ClubLineup? lineup = await _clubLineupRepository.GetAsync(
      l => l.ClubId == botClubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (lineup == null)
    {
      return;
    }

    lineup.Formation = template.PreferredFormation.Value;
  }

  private static ClubDraftStateDto BuildState(Club club, GameOptions options)
  {
    List<DraftPickDto> picks = club.DraftPicks
      .OrderBy(p => p.PickOrder)
      .Select(p =>
      {
        int overall = BasePlayerRatingCalculator.Calculate(p.BasePlayer);
        return new DraftPickDto
        {
          BasePlayerId = p.BasePlayerId,
          PickOrder = p.PickOrder,
          DefaultFirstName = p.BasePlayer.DefaultFirstName,
          DefaultLastName = p.BasePlayer.DefaultLastName,
          Position = p.BasePlayer.Position,
          OverallRating = overall,
          DraftTier = p.BasePlayer.DraftTier,
          DraftFee = p.BasePlayer.DraftFee,
          Wage = p.BasePlayer.Wage
        };
      })
      .ToList();

    decimal spentFees = picks.Sum(p => p.DraftFee);
    decimal committedWages = picks.Sum(p => p.Wage);

    List<DraftQuotaDto> quotas = ClubDraftBusinessRules.GetQuotaMap(options)
      .Select(q =>
      {
        int selected = picks.Count(p => p.Position == q.Position);
        return new DraftQuotaDto
        {
          Position = q.Position,
          Required = q.Required,
          Selected = selected,
          Remaining = Math.Max(0, q.Required - selected)
        };
      })
      .ToList();

    bool canFinalize = quotas.All(q => q.Remaining == 0)
      && club.Cash - spentFees >= 0
      && club.WageBudget - committedWages >= 0;

    return new ClubDraftStateDto
    {
      ClubId = club.Id,
      ClubName = club.Name,
      LifecycleStatus = club.LifecycleStatus,
      Cash = club.Cash,
      WageBudget = club.WageBudget,
      SpentFees = spentFees,
      CommittedWages = committedWages,
      RemainingCash = club.Cash - spentFees,
      RemainingWageBudget = club.WageBudget - committedWages,
      CanFinalize = canFinalize,
      Quotas = quotas,
      Picks = picks
    };
  }

  private static string BuildTutorialDivisionName(string clubName)
  {
    string trimmed = clubName.Trim();

    if (trimmed.Length > 80)
    {
      trimmed = trimmed[..80];
    }

    return $"{trimmed} Tutorial";
  }
}
