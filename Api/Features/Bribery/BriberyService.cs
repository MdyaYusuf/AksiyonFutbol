using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.Matches;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Bribery;

public class BriberyService(
  IBribeAttemptRepository _bribeAttemptRepository,
  IClubRepository _clubRepository,
  BriberyBusinessRules _businessRules,
  BriberyMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<CreateBribeAttemptRequest> _createValidator,
  IMatchSettlementGate _settlementGate) : IBriberyService
{
  public async Task<ReturnModel<BriberyContextResponseDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    ClubPublicView view = await _settlementGate.GetPublicViewAsync(club, cancellationToken);
    ClubContext clubContext = new(club.Id, club.Name, view.Cash);
    decimal minAmount = _businessRules.Options.BribeMinAmount;
    decimal maxAmount = _businessRules.Options.BribeMaxAmount;

    if (view.CashSpendLocked)
    {
      return new ReturnModel<BriberyContextResponseDto>()
      {
        Success = true,
        Message = "Rüşvet bağlamı başarılı bir şekilde getirildi.",
        Data = _mapper.ToUnavailableContextDto(
          clubContext,
          MatchLiveWindow.SpendLockedReason,
          minAmount,
          maxAmount),
        StatusCode = 200
      };
    }

    Match? match = await _businessRules.GetNextUnplayedMatchForClubOrNullAsync(
      club.Id,
      cancellationToken);

    if (match == null)
    {
      return new ReturnModel<BriberyContextResponseDto>()
      {
        Success = true,
        Message = "Rüşvet bağlamı başarılı bir şekilde getirildi.",
        Data = _mapper.ToUnavailableContextDto(
          clubContext,
          "No upcoming fixture available.",
          minAmount,
          maxAmount),
        StatusCode = 200
      };
    }

    if (!match.RefereeId.HasValue || match.Referee == null)
    {
      return new ReturnModel<BriberyContextResponseDto>()
      {
        Success = true,
        Message = "Rüşvet bağlamı başarılı bir şekilde getirildi.",
        Data = _mapper.ToUnavailableContextDto(
          clubContext,
          "No referee assigned to the upcoming fixture.",
          minAmount,
          maxAmount),
        StatusCode = 200
      };
    }

    BribeAttempt? existing = await _bribeAttemptRepository.GetAsync(
      a => a.ClubId == club.Id && a.MatchId == match.Id,
      cancellationToken: cancellationToken);

    decimal previewAmount = Math.Clamp(
      club.Cash * 0.1m,
      minAmount,
      maxAmount);

    decimal estimatedChance = _businessRules.CalculateSuccessChance(previewAmount, match.Referee);

    BriberyContextResponseDto response = _mapper.ToContextDto(
      clubContext,
      match,
      match.Referee,
      alreadyAttempted: existing != null,
      existingOutcome: existing?.Outcome,
      estimatedSuccessChance: estimatedChance,
      minAmount: minAmount,
      maxAmount: maxAmount);

    return new ReturnModel<BriberyContextResponseDto>()
    {
      Success = true,
      Message = "Rüşvet bağlamı başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<BribeAttemptResponseDto>> CreateAttemptForCurrentUserAsync(
    CreateBribeAttemptRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: query => query.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _settlementGate.MustAllowClubSpendAsync(club.Id, cancellationToken);

    Match match = request.MatchId.HasValue
      ? await _businessRules.GetMatchIfExistAsync(request.MatchId.Value, cancellationToken)
      : await _businessRules.GetNextUnplayedMatchForClubAsync(club.Id, cancellationToken);

    _businessRules.MatchMustBeUnplayed(match);
    _businessRules.MatchMustBelongToClub(match, club.Id);
    _businessRules.MatchMustHaveReferee(match);
    await _businessRules.EnsureNoExistingAttemptAsync(club.Id, match.Id, cancellationToken);
    _businessRules.ClubMustAffordBribe(club, request.Amount);

    decimal successChance = _businessRules.CalculateSuccessChance(request.Amount, match.Referee!);
    bool succeeded = Random.Shared.NextDouble() <= (double)successChance;

    club.Cash -= request.Amount;
    _clubRepository.Update(club);

    BribeAttempt attempt = new()
    {
      ClubId = club.Id,
      MatchId = match.Id,
      RefereeId = match.RefereeId!.Value,
      Amount = request.Amount,
      SuccessChance = successChance,
      Outcome = succeeded ? BribeAttemptOutcome.Succeeded : BribeAttemptOutcome.Failed
    };

    await _bribeAttemptRepository.AddAsync(attempt, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    BribeAttempt created = await _bribeAttemptRepository.GetByIdAsync(
      attempt.Id,
      include: _businessRules.AttemptDetailInclude(),
      cancellationToken: cancellationToken)
      ?? attempt;

    string message = succeeded
      ? "Rüşvet girişimi başarılı oldu. Hakem maçta kulübünüzü kayırabilir."
      : "Rüşvet girişimi başarısız oldu. Ödenen tutar kasadan düşüldü.";

    return new ReturnModel<BribeAttemptResponseDto>()
    {
      Success = true,
      Message = message,
      Data = _mapper.EntityToResponseDto(created),
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<List<BribeAttemptResponseDto>>> GetMyAttemptsAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    List<BribeAttempt> attempts = await _bribeAttemptRepository.GetAllAsync(
      filter: a => a.ClubId == club.Id,
      include: _businessRules.AttemptDetailInclude(),
      orderBy: query => query.OrderByDescending(a => a.CreatedDate),
      cancellationToken: cancellationToken);

    List<BribeAttemptResponseDto> response = attempts
      .Select(_mapper.EntityToResponseDto)
      .ToList();

    return new ReturnModel<List<BribeAttemptResponseDto>>()
    {
      Success = true,
      Message = "Rüşvet geçmişi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }
}
