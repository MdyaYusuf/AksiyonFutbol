using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Api.Features.Referees;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Actions;

public class ClubActionService(
  IClubActionRepository _clubActionRepository,
  IClubRepository _clubRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IClubActionProvider _actionProvider,
  ClubActionBusinessRules _businessRules,
  ClubActionMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<ExecuteClubActionRequest> _executeValidator) : IClubActionService
{
  public async Task<ReturnModel<ClubActionsContextResponseDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    Match? upcomingMatch = await _businessRules.GetNextUnplayedMatchForClubOrNullAsync(
      club.Id,
      cancellationToken);

    List<ClubAction> actions = await _clubActionRepository.GetAllAsync(
      filter: a => a.ClubId == club.Id,
      orderBy: query => query.OrderByDescending(a => a.CreatedDate),
      cancellationToken: cancellationToken);

    List<ClubActionAvailabilityDto> availabilities = _actionProvider.All()
      .Select(definition => BuildAvailability(definition, club, upcomingMatch, actions))
      .ToList();

    ClubActionsContextResponseDto response = new()
    {
      ClubId = club.Id,
      ClubName = club.Name,
      ClubCash = club.Cash,
      Suspicion = club.Suspicion,
      MaxSuspicion = _businessRules.Options.MaxSuspicion,
      UpcomingMatch = upcomingMatch == null
        ? null
        : _mapper.ToUpcomingMatchSummary(upcomingMatch, club.Id),
      Actions = availabilities
    };

    return new ReturnModel<ClubActionsContextResponseDto>()
    {
      Success = true,
      Message = "Aksiyon bağlamı başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubActionResultDto>> ExecuteForCurrentUserAsync(
    ExecuteClubActionRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _executeValidator.ValidateAndThrowAsync(request, cancellationToken);

    ClubActionDefinition definition = _actionProvider.Get(request.ActionType);

    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    Match? match = null;
    decimal pledgedWinBonus = 0m;
    Guid? targetPlayerInstanceId = null;
    Club? mediaSpinOpponent = null;

    if (definition.IsMatchScoped)
    {
      match = await _businessRules.GetMatchForActionAsync(request.MatchId, club.Id, cancellationToken);
      _businessRules.MatchMustBeUnplayed(match);
      _businessRules.MatchMustBelongToClub(match, club.Id);
      await EnsureMatchActionNotRepeatedAsync(club.Id, match.Id, definition.Type, cancellationToken);

      if (definition.Type == ClubActionType.Sabotage)
      {
        EnsureSabotageIsHome(match, club.Id);
      }
    }
    else
    {
      await EnsureNotOnCooldownAsync(club.Id, definition, cancellationToken);

      if (definition.Type == ClubActionType.PromiseWinBonus)
      {
        match = await _businessRules.GetNextUnplayedMatchForClubOrNullAsync(
          club.Id,
          cancellationToken);

        if (match == null)
        {
          throw new BusinessException("Galibiyet primi için yaklaşan bir maç bulunamadı.");
        }

        await EnsureMatchActionNotRepeatedAsync(
          club.Id,
          match.Id,
          ClubActionType.PromiseWinBonus,
          cancellationToken);

        pledgedWinBonus = _businessRules.GetPromiseWinBonusAmount();
        _businessRules.ClubMustAfford(club, pledgedWinBonus);
      }
      else if (definition.Type == ClubActionType.MediaSpin)
      {
        (match, mediaSpinOpponent) = await PrepareMediaSpinAsync(
          request,
          club,
          cancellationToken);
      }
      else if (definition.Type == ClubActionType.LobbyFederation)
      {
        _businessRules.EnsurePresidentCanAffordLobby(club);
      }
      else if (definition.Type == ClubActionType.TapUpTarget)
      {
        targetPlayerInstanceId = await ValidateTapUpTargetAsync(
          club.Id,
          request.TargetPlayerInstanceId,
          cancellationToken);
      }
    }

    _businessRules.ClubMustAfford(club, definition.Cost);

    int suspicionBefore = club.Suspicion;
    decimal successChance = _businessRules.CalculateSuccessChance(definition, match);
    decimal detectionChance = _businessRules.CalculateDetectionChance(definition, suspicionBefore);

    club.Cash -= definition.Cost;
    int heatApplied = ApplyHeat(club, definition);

    bool succeeded = Random.Shared.NextDouble() <= (double)successChance;
    bool wasDetected = definition.IsShady && Random.Shared.NextDouble() <= (double)detectionChance;

    if (succeeded && definition.Category == ClubActionCategory.Squad)
    {
      ApplySquadEffects(club, definition.Type);
    }

    if (succeeded && definition.Category == ClubActionCategory.Politics)
    {
      ApplyPoliticsEffects(
        definition.Type,
        request.MediaSpinMode,
        club,
        mediaSpinOpponent);
    }

    InvestigationConsequence? investigation = null;

    if (wasDetected)
    {
      investigation = ApplyDetectionConsequences(
        club,
        definition.Type,
        definition.IsMatchScoped);
    }

    _clubRepository.Update(club);

    if (mediaSpinOpponent != null)
    {
      _clubRepository.Update(mediaSpinOpponent);
    }

    decimal cashRecorded = definition.Type == ClubActionType.PromiseWinBonus && succeeded
      ? pledgedWinBonus
      : definition.Cost;

    ClubAction action = new()
    {
      ClubId = club.Id,
      MatchId = match?.Id,
      TargetPlayerInstanceId = targetPlayerInstanceId,
      ActionType = definition.Type,
      Outcome = succeeded ? ClubActionOutcome.Succeeded : ClubActionOutcome.Failed,
      WasDetected = wasDetected,
      HeatGenerated = heatApplied,
      CashSpent = cashRecorded,
      SuccessChance = successChance,
      DetectionChance = detectionChance,
      FineAmount = investigation?.FineAmount ?? 0m,
      ScandalMoralePenaltyApplied = investigation?.MoralePenalty ?? 0,
      ScandalReputationPenaltyApplied = investigation?.ReputationPenalty ?? 0,
      MatchPenaltyApplied = investigation?.MatchPenaltyApplied ?? false
    };

    await _clubActionRepository.AddAsync(action, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    // In-memory only, so the mapper can surface the match week. Not persisted.
    action.Match = match;

    return new ReturnModel<ClubActionResultDto>()
    {
      Success = true,
      Message = BuildResultMessage(definition, succeeded, wasDetected, match, request.MediaSpinMode),
      Data = _mapper.ToResultDto(action, club, investigation),
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<List<ClubActionDto>>> GetMyHistoryAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    List<ClubAction> actions = await _clubActionRepository.GetAllAsync(
      filter: a => a.ClubId == club.Id,
      include: query => query.Include(a => a.Match),
      orderBy: query => query.OrderByDescending(a => a.CreatedDate),
      cancellationToken: cancellationToken);

    List<ClubActionDto> response = actions
      .Select(_mapper.ToDto)
      .ToList();

    return new ReturnModel<List<ClubActionDto>>()
    {
      Success = true,
      Message = "Aksiyon geçmişi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  private ClubActionAvailabilityDto BuildAvailability(
    ClubActionDefinition definition,
    Club club,
    Match? upcomingMatch,
    List<ClubAction> actions)
  {
    decimal detectionChance = _businessRules.CalculateDetectionChance(definition, club.Suspicion);
    decimal successChance = _businessRules.CalculateSuccessChance(definition, upcomingMatch);

    bool isAvailable = true;
    string? unavailableReason = null;
    int cooldownRemainingDays = 0;

    if (definition.IsMatchScoped)
    {
      if (upcomingMatch == null)
      {
        isAvailable = false;
        unavailableReason = "No upcoming fixture available.";
      }
      else if (actions.Any(a => a.MatchId == upcomingMatch.Id && a.ActionType == definition.Type))
      {
        isAvailable = false;
        unavailableReason = "Already used for this fixture.";
      }
      else if (definition.Type == ClubActionType.Sabotage && upcomingMatch.HomeClubId != club.Id)
      {
        isAvailable = false;
        unavailableReason = "Only available when playing at home.";
      }
    }
    else
    {
      cooldownRemainingDays = ComputeCooldownRemainingDays(definition, actions);

      if (cooldownRemainingDays > 0)
      {
        isAvailable = false;
        unavailableReason = $"On cooldown ({cooldownRemainingDays} day(s) left).";
      }
      else if (definition.Type == ClubActionType.PromiseWinBonus)
      {
        if (upcomingMatch == null)
        {
          isAvailable = false;
          unavailableReason = "No upcoming fixture available.";
        }
        else if (actions.Any(a =>
          a.MatchId == upcomingMatch.Id &&
          a.ActionType == ClubActionType.PromiseWinBonus))
        {
          isAvailable = false;
          unavailableReason = "Already promised for this fixture.";
        }
        else if (club.Cash < _businessRules.GetPromiseWinBonusAmount())
        {
          isAvailable = false;
          unavailableReason = "Insufficient funds for the promised bonus.";
        }
      }
      else if (definition.Type == ClubActionType.LobbyFederation)
      {
        int reputationCost = _businessRules.Options.LobbyFederationReputationCost;

        if (club.President == null || club.President.ReputationPoints < reputationCost)
        {
          isAvailable = false;
          unavailableReason = "Insufficient reputation.";
        }
      }
    }

    if (isAvailable && club.Cash < definition.Cost)
    {
      isAvailable = false;
      unavailableReason = "Insufficient funds.";
    }

    decimal displayCost = definition.Type == ClubActionType.PromiseWinBonus
      ? _businessRules.GetPromiseWinBonusAmount()
      : definition.Cost;

    return new ClubActionAvailabilityDto
    {
      ActionType = definition.Type,
      Category = definition.Category,
      DisplayName = definition.DisplayName,
      Description = definition.Description,
      Cost = displayCost,
      HeatGenerated = definition.IsShady ? definition.HeatGenerated : 0,
      SuccessChance = successChance,
      DetectionChance = detectionChance,
      IsShady = definition.IsShady,
      RequiresMatch = definition.IsMatchScoped || definition.Type == ClubActionType.PromiseWinBonus,
      IsAvailable = isAvailable,
      UnavailableReason = unavailableReason,
      CooldownDays = definition.CooldownDays,
      CooldownRemainingDays = cooldownRemainingDays
    };
  }

  private static int ComputeCooldownRemainingDays(ClubActionDefinition definition, List<ClubAction> actions)
  {
    if (definition.CooldownDays <= 0)
    {
      return 0;
    }

    ClubAction? lastAction = actions.FirstOrDefault(a => a.ActionType == definition.Type);

    if (lastAction == null)
    {
      return 0;
    }

    DateTime availableAt = lastAction.CreatedDate.AddDays(definition.CooldownDays);
    double remaining = (availableAt - DateTime.UtcNow).TotalDays;

    if (remaining <= 0)
    {
      return 0;
    }

    return (int)Math.Ceiling(remaining);
  }

  private async Task EnsureMatchActionNotRepeatedAsync(
    Guid clubId,
    Guid matchId,
    ClubActionType actionType,
    CancellationToken cancellationToken)
  {
    bool exists = await _clubActionRepository.AnyAsync(
      a => a.ClubId == clubId && a.MatchId == matchId && a.ActionType == actionType,
      cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu maç için bu aksiyon zaten gerçekleştirilmiş.");
    }
  }

  private async Task EnsureNotOnCooldownAsync(
    Guid clubId,
    ClubActionDefinition definition,
    CancellationToken cancellationToken)
  {
    if (definition.CooldownDays <= 0)
    {
      return;
    }

    List<ClubAction> recent = await _clubActionRepository.GetAllAsync(
      filter: a => a.ClubId == clubId && a.ActionType == definition.Type,
      orderBy: query => query.OrderByDescending(a => a.CreatedDate),
      cancellationToken: cancellationToken);

    int remaining = ComputeCooldownRemainingDays(definition, recent);

    if (remaining > 0)
    {
      throw new BusinessException($"Bu aksiyon için {remaining} gün beklemelisiniz.");
    }
  }

  private static string BuildResultMessage(
    ClubActionDefinition definition,
    bool succeeded,
    bool wasDetected,
    Match? match,
    MediaSpinMode? mediaSpinMode)
  {
    if (wasDetected)
    {
      return succeeded
        ? "Aksiyon başarılı oldu ancak yakalandınız. Soruşturma sonuçları uygulandı."
        : "Aksiyon başarısız oldu ve yakalandınız. Soruşturma sonuçları uygulandı.";
    }

    if (!definition.IsShady)
    {
      return "Aksiyon gerçekleştirildi.";
    }

    if (!succeeded &&
        definition.Type == ClubActionType.IntimidateReferee &&
        match?.Referee != null &&
        (match.Referee.PersonalityType == RefereePersonalityType.Strict ||
         match.Referee.PersonalityType == RefereePersonalityType.Showman))
    {
      return "Tehdit geri tepti. Hakem rakibe yanaşacak.";
    }

    if (succeeded && definition.Type == ClubActionType.MediaSpin)
    {
      return mediaSpinMode == MediaSpinMode.ReputationRepair
        ? "Medya spin başarılı. İtibar onarıldı."
        : "Medya spin başarılı. Rakip moral düşürüldü.";
    }

    if (succeeded && definition.Type == ClubActionType.LobbyFederation)
    {
      return "Federasyon lobiciliği başarılı. Şüphe azaltıldı.";
    }

    if (succeeded && definition.Type == ClubActionType.DodgySponsorship)
    {
      return "Şüpheli sponsorluk başarılı. Kasaya nakit girdi.";
    }

    if (succeeded && definition.Type == ClubActionType.TapUpTarget)
    {
      return "Tap-up başarılı. Hedef oyuncu için transfer indirimi aktif.";
    }

    return succeeded
      ? "Aksiyon başarılı oldu."
      : "Aksiyon başarısız oldu. Harcanan tutar kasadan düşüldü.";
  }

  private async Task<(Match? Match, Club? Opponent)> PrepareMediaSpinAsync(
    ExecuteClubActionRequest request,
    Club club,
    CancellationToken cancellationToken)
  {
    if (request.MediaSpinMode == MediaSpinMode.ReputationRepair)
    {
      _businessRules.EnsurePresidentExists(club);
      return (null, null);
    }

    if (request.MediaSpinMode != MediaSpinMode.OpponentMorale)
    {
      throw new BusinessException("Geçerli bir medya spin modu belirtilmelidir.");
    }

    Match? upcoming = await _businessRules.GetNextUnplayedMatchForClubOrNullAsync(
      club.Id,
      cancellationToken);

    if (upcoming == null)
    {
      throw new BusinessException("Rakip moral düşürmek için yaklaşan bir maç bulunamadı.");
    }

    Guid opponentId = upcoming.HomeClubId == club.Id
      ? upcoming.AwayClubId
      : upcoming.HomeClubId;

    Club opponent = await _businessRules.GetClubByIdIfExistAsync(
      opponentId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    return (upcoming, opponent);
  }

  private void ApplyPoliticsEffects(
    ClubActionType actionType,
    MediaSpinMode? mediaSpinMode,
    Club club,
    Club? mediaSpinOpponent)
  {
    GameOptions options = _businessRules.Options;

    switch (actionType)
    {
      case ClubActionType.MediaSpin when mediaSpinMode == MediaSpinMode.ReputationRepair:
        _businessRules.EnsurePresidentExists(club);
        club.President!.ReputationPoints += options.MediaSpinReputationRepair;
        break;
      case ClubActionType.MediaSpin when mediaSpinMode == MediaSpinMode.OpponentMorale:
        if (mediaSpinOpponent == null)
        {
          throw new BusinessException("Rakip kulüp bulunamadı.");
        }

        mediaSpinOpponent.Morale = ClampStatus(
          mediaSpinOpponent.Morale - options.MediaSpinOpponentMoralePenalty);
        break;
      case ClubActionType.LobbyFederation:
        _businessRules.EnsurePresidentCanAffordLobby(club);
        club.President!.ReputationPoints -= options.LobbyFederationReputationCost;
        club.Suspicion = Math.Max(0, club.Suspicion - options.LobbyFederationSuspicionReduction);
        break;
      case ClubActionType.DodgySponsorship:
        club.Cash += options.DodgySponsorshipCashGain;
        break;
      case ClubActionType.TapUpTarget:
        // Effect is deferred: discount applies at transfer accept time.
        break;
    }
  }

  private void ApplySquadEffects(Club club, ClubActionType actionType)
  {
    GameOptions options = _businessRules.Options;

    switch (actionType)
    {
      case ClubActionType.TeamBonding:
        club.Chemistry = ClampStatus(club.Chemistry + options.TeamBondingChemistryBonus);
        club.Discipline = ClampStatus(club.Discipline - options.TeamBondingDisciplinePenalty);
        break;
      case ClubActionType.FinePlayer:
        club.Discipline = ClampStatus(club.Discipline + options.FinePlayerDisciplineBonus);
        club.Morale = ClampStatus(club.Morale - options.FinePlayerMoralePenalty);
        break;
      case ClubActionType.MotivationalTalk:
        club.Morale = ClampStatus(club.Morale + options.MotivationalTalkMoraleBonus);
        break;
      case ClubActionType.BrutalTraining:
        club.Morale = ClampStatus(club.Morale - options.BrutalTrainingMoralePenalty);
        club.Discipline = ClampStatus(club.Discipline + options.BrutalTrainingDisciplineBonus);
        break;
      case ClubActionType.PromiseWinBonus:
        club.Morale = ClampStatus(club.Morale + options.PromiseWinBonusMoraleBonus);
        break;
    }
  }

  private int ApplyHeat(Club club, ClubActionDefinition definition)
  {
    if (!definition.IsShady || definition.HeatGenerated <= 0)
    {
      return 0;
    }

    int newSuspicion = Math.Clamp(
      club.Suspicion + definition.HeatGenerated,
      0,
      _businessRules.Options.MaxSuspicion);

    int applied = newSuspicion - club.Suspicion;
    club.Suspicion = newSuspicion;

    return applied;
  }

  private InvestigationConsequence ApplyDetectionConsequences(
    Club club,
    ClubActionType actionType,
    bool isMatchScoped)
  {
    GameOptions options = _businessRules.Options;

    decimal fineAmount = Math.Round(club.Cash * options.ScandalFineCashRatio, 2);

    if (fineAmount < 0m)
    {
      fineAmount = 0m;
    }

    club.Cash = Math.Max(0m, club.Cash - fineAmount);

    int moraleBefore = club.Morale;
    club.Morale = ClampStatus(club.Morale - options.ScandalMoralePenalty);
    int moralePenalty = moraleBefore - club.Morale;

    int reputationPenalty = 0;

    if (club.President != null && options.ScandalReputationPenalty > 0)
    {
      int reputationBefore = club.President.ReputationPoints;
      club.President.ReputationPoints = Math.Max(
        0,
        club.President.ReputationPoints - options.ScandalReputationPenalty);
      reputationPenalty = reputationBefore - club.President.ReputationPoints;
    }

    bool matchPenaltyApplied = isMatchScoped &&
      (actionType == ClubActionType.Doping || actionType == ClubActionType.MatchFixing);

    return new InvestigationConsequence
    {
      FineAmount = fineAmount,
      MoralePenalty = moralePenalty,
      ReputationPenalty = reputationPenalty,
      MatchPenaltyApplied = matchPenaltyApplied
    };
  }

  private static int ClampStatus(int value) => Math.Clamp(value, 0, 100);

  private async Task<Guid> ValidateTapUpTargetAsync(
    Guid clubId,
    Guid? targetPlayerInstanceId,
    CancellationToken cancellationToken)
  {
    if (!targetPlayerInstanceId.HasValue)
    {
      throw new BusinessException("Tap-up için bir oyuncu seçilmelidir.");
    }

    PlayerInstance? player = await _playerInstanceRepository.GetByIdAsync(
      targetPlayerInstanceId.Value,
      cancellationToken: cancellationToken);

    if (player == null)
    {
      throw new NotFoundException("Tap-up hedef oyuncu bulunamadı.");
    }

    if (player.ClubId == clubId)
    {
      throw new BusinessException("Kendi oyuncunuza tap-up yapamazsınız.");
    }

    bool alreadyTapped = await _clubActionRepository.AnyAsync(
      a =>
        a.ClubId == clubId &&
        a.TargetPlayerInstanceId == player.Id &&
        a.ActionType == ClubActionType.TapUpTarget &&
        a.Outcome == ClubActionOutcome.Succeeded,
      cancellationToken);

    if (alreadyTapped)
    {
      throw new BusinessException("Bu oyuncu için zaten aktif bir tap-up mevcut.");
    }

    return player.Id;
  }

  private static void EnsureSabotageIsHome(Match match, Guid clubId)
  {
    if (match.HomeClubId != clubId)
    {
      throw new BusinessException("Deplasman sabotajı yalnızca ev sahibi olduğunuz maçlarda kullanılabilir.");
    }
  }
}
