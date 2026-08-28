using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.LeaguePress;
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
  IMatchSettlementGate _settlementGate,
  IClubScandalSettler _scandalSettler,
  IPresidentMoralitySettler _moralitySettler,
  ILeaguePressEventPublisher _pressPublisher) : IBriberyService
{
  public async Task<ReturnModel<BriberyContextResponseDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: query => query.Include(c => c.President),
      cancellationToken: cancellationToken);

    ClubPublicView view = await _settlementGate.GetPublicViewAsync(club, cancellationToken);
    ClubContext clubContext = new(
      club.Id,
      club.DisplayName,
      view.Cash,
      club.Suspicion,
      _businessRules.Options.MaxSuspicion);
    decimal minAmount = _businessRules.Options.BribeMinAmount;
    decimal maxAmount = _businessRules.Options.BribeMaxAmount;

    if (view.CashSpendLocked)
    {
      return new ReturnModel<BriberyContextResponseDto>()
      {
        Success = true,
        Message = "Maç etkisi bağlamı başarılı bir şekilde getirildi.",
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
        Message = "Maç etkisi bağlamı başarılı bir şekilde getirildi.",
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
        Message = "Maç etkisi bağlamı başarılı bir şekilde getirildi.",
        Data = _mapper.ToUnavailableContextDto(
          clubContext,
          "No official assigned to the upcoming fixture.",
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
    List<BriberyStakeOptionDto> stakeOptions = _businessRules.BuildStakeOptions(
      minAmount,
      maxAmount,
      club.Suspicion,
      match.Referee,
      club.President);

    BriberyContextResponseDto response = _mapper.ToContextDto(
      clubContext,
      match,
      match.Referee,
      alreadyAttempted: existing != null,
      existingOutcome: existing?.Outcome,
      estimatedSuccessChance: estimatedChance,
      minAmount: minAmount,
      maxAmount: maxAmount,
      stakeOptions: stakeOptions);

    return new ReturnModel<BriberyContextResponseDto>()
    {
      Success = true,
      Message = "Maç etkisi bağlamı başarılı bir şekilde getirildi.",
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

    decimal minAmount = _businessRules.Options.BribeMinAmount;
    decimal maxAmount = _businessRules.Options.BribeMaxAmount;
    BribeStakeTier stakeTier = _businessRules.ResolveStakeTier(
      request.Amount,
      minAmount,
      maxAmount);
    int heatAmount = _businessRules.GetHeatForTier(stakeTier);
    decimal baseDetection = _businessRules.GetBaseDetectionForTier(stakeTier);

    int suspicionBefore = club.Suspicion;
    decimal detectionChance = _businessRules.CalculateDetectionChance(
      baseDetection,
      suspicionBefore,
      club.President);
    decimal successChance = _businessRules.CalculateSuccessChance(request.Amount, match.Referee!);

    club.Cash -= request.Amount;
    int heatApplied = _scandalSettler.ApplyHeat(club, heatAmount);

    bool succeeded = Random.Shared.NextDouble() <= (double)successChance;
    bool wasDetected = Random.Shared.NextDouble() <= (double)detectionChance;

    ClubScandalConsequence? scandal = null;

    if (succeeded && !wasDetected)
    {
      ApplyShadySuccessInfamyGain(club);
    }

    if (wasDetected)
    {
      scandal = _scandalSettler.ApplyScandal(club);

      await _pressPublisher.PublishAsync(
        new LeaguePressEvent(
          LeaguePressEventType.ScandalDetected,
          club.Id,
          match.Id,
          "scandal.bribery.detected"),
        cancellationToken);
    }

    _clubRepository.Update(club);

    BribeAttempt attempt = new()
    {
      ClubId = club.Id,
      MatchId = match.Id,
      RefereeId = match.RefereeId!.Value,
      Amount = request.Amount,
      SuccessChance = successChance,
      DetectionChance = detectionChance,
      Outcome = succeeded ? BribeAttemptOutcome.Succeeded : BribeAttemptOutcome.Failed,
      WasDetected = wasDetected,
      HeatGenerated = heatApplied,
      FineAmount = scandal?.FineAmount ?? 0m,
      ScandalMoralePenaltyApplied = scandal?.MoralePenalty ?? 0,
      ScandalReputationPenaltyApplied = scandal?.ReputationPenalty ?? 0
    };

    await _bribeAttemptRepository.AddAsync(attempt, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    BribeAttempt created = await _bribeAttemptRepository.GetByIdAsync(
      attempt.Id,
      include: _businessRules.AttemptDetailInclude(),
      cancellationToken: cancellationToken)
      ?? attempt;

    string message = BuildResultMessage(succeeded, wasDetected);

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
      Message = "Maç etkisi geçmişi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  private void ApplyShadySuccessInfamyGain(Club club)
  {
    if (club.President == null)
    {
      return;
    }

    int gain = _businessRules.Options.ShadySuccessInfamyGain;

    if (gain <= 0)
    {
      return;
    }

    _moralitySettler.ApplyInfamyGain(club.President, gain);
  }

  private static string BuildResultMessage(bool succeeded, bool wasDetected)
  {
    if (wasDetected)
    {
      return succeeded
        ? "Yaklaşım başarılı oldu ancak yakalandınız. Soruşturma sonuçları uygulandı."
        : "Yaklaşım başarısız oldu ve yakalandınız. Soruşturma sonuçları uygulandı.";
    }

    if (succeeded)
    {
      return "Yaklaşım başarılı oldu. Hakem maçta kulübünüzü kayırabilir.";
    }

    return "Yaklaşım başarısız oldu. Ödenen tutar kasadan düşüldü.";
  }
}
