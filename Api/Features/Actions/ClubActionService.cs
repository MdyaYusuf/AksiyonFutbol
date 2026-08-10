using Api.Core.Exceptions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.Matches;
using Api.Features.Referees;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Actions;

public class ClubActionService(
  IClubActionRepository _clubActionRepository,
  IClubRepository _clubRepository,
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
    }

    _businessRules.ClubMustAfford(club, definition.Cost);

    int suspicionBefore = club.Suspicion;
    decimal successChance = _businessRules.CalculateSuccessChance(definition, match);
    decimal detectionChance = _businessRules.CalculateDetectionChance(definition, suspicionBefore);

    club.Cash -= definition.Cost;
    int heatApplied = _businessRules.ApplyHeat(club, definition);

    bool succeeded = Random.Shared.NextDouble() <= (double)successChance;
    bool wasDetected = definition.IsShady && Random.Shared.NextDouble() <= (double)detectionChance;

    if (succeeded && definition.Category == ClubActionCategory.Squad)
    {
      _businessRules.ApplySquadEffects(club, definition.Type);
    }

    _clubRepository.Update(club);

    decimal cashRecorded = definition.Type == ClubActionType.PromiseWinBonus && succeeded
      ? pledgedWinBonus
      : definition.Cost;

    ClubAction action = new()
    {
      ClubId = club.Id,
      MatchId = match?.Id,
      ActionType = definition.Type,
      Outcome = succeeded ? ClubActionOutcome.Succeeded : ClubActionOutcome.Failed,
      WasDetected = wasDetected,
      HeatGenerated = heatApplied,
      CashSpent = cashRecorded,
      SuccessChance = successChance,
      DetectionChance = detectionChance
    };

    await _clubActionRepository.AddAsync(action, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    // In-memory only, so the mapper can surface the match week. Not persisted.
    action.Match = match;

    return new ReturnModel<ClubActionResultDto>()
    {
      Success = true,
      Message = BuildResultMessage(definition, succeeded, match),
      Data = _mapper.ToResultDto(action, club),
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
    Match? match)
  {
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

    return succeeded
      ? "Aksiyon başarılı oldu."
      : "Aksiyon başarısız oldu. Harcanan tutar kasadan düşüldü.";
  }

  private static void EnsureSabotageIsHome(Match match, Guid clubId)
  {
    if (match.HomeClubId != clubId)
    {
      throw new BusinessException("Deplasman sabotajı yalnızca ev sahibi olduğunuz maçlarda kullanılabilir.");
    }
  }
}
