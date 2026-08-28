using Api.Core.Options;
using Api.Features.Actions;
using Api.Features.Bribery;
using Api.Features.Clubs;
using Api.Features.Matches;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubPresidents;

public interface IPresidentAttributeGrowthSettler
{
  Task SettleAfterMatchAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default);
}

public class PresidentAttributeGrowthSettler(
  IClubActionRepository _clubActionRepository,
  IBribeAttemptRepository _bribeAttemptRepository,
  IOptions<GameOptions> _gameOptions) : IPresidentAttributeGrowthSettler
{
  public async Task SettleAfterMatchAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default)
  {
    GameOptions options = _gameOptions.Value;

    if (!HasAnyGrowthConfigured(options))
    {
      return;
    }

    await SettleClubAsync(
      match.HomeClub,
      match.Id,
      homeScore > awayScore,
      homeScore != awayScore,
      options,
      cancellationToken);

    await SettleClubAsync(
      match.AwayClub,
      match.Id,
      awayScore > homeScore,
      homeScore != awayScore,
      options,
      cancellationToken);
  }

  private async Task SettleClubAsync(
    Club club,
    Guid matchId,
    bool isWinner,
    bool hadResult,
    GameOptions options,
    CancellationToken cancellationToken)
  {
    if (!hadResult || club.IsBot || club.President == null)
    {
      return;
    }

    ClubPresident president = club.President;

    bool hadDetectedScandal = await HadDetectedScandalAsync(
      club.Id,
      matchId,
      cancellationToken);

    if (hadDetectedScandal)
    {
      ApplyIntegrityLoss(president, options.PostMatchScandalIntegrityLoss);
      return;
    }

    if (isWinner)
    {
      ApplyCleanWinGrowth(president, options);
    }

    bool hadUndetectedShadySuccess = await HadUndetectedShadySuccessAsync(
      club.Id,
      matchId,
      cancellationToken);

    if (hadUndetectedShadySuccess)
    {
      ApplyCunningGain(president, options.PostMatchUndetectedShadyCunningGain);
    }
  }

  private async Task<bool> HadDetectedScandalAsync(
    Guid clubId,
    Guid matchId,
    CancellationToken cancellationToken)
  {
    bool actionDetected = await _clubActionRepository.AnyAsync(
      a =>
        a.MatchId == matchId &&
        a.ClubId == clubId &&
        a.WasDetected,
      cancellationToken);

    if (actionDetected)
    {
      return true;
    }

    return await _bribeAttemptRepository.AnyAsync(
      a =>
        a.MatchId == matchId &&
        a.ClubId == clubId &&
        a.WasDetected,
      cancellationToken);
  }

  private async Task<bool> HadUndetectedShadySuccessAsync(
    Guid clubId,
    Guid matchId,
    CancellationToken cancellationToken)
  {
    List<ClubAction> shadyActions = await _clubActionRepository.GetAllAsync(
      filter: a =>
        a.MatchId == matchId &&
        a.ClubId == clubId &&
        a.Outcome == ClubActionOutcome.Succeeded &&
        !a.WasDetected,
      cancellationToken: cancellationToken);

    foreach (ClubAction action in shadyActions)
    {
      if (ClubActionCatalog.Get(action.ActionType).IsShady)
      {
        return true;
      }
    }

    return await _bribeAttemptRepository.AnyAsync(
      a =>
        a.MatchId == matchId &&
        a.ClubId == clubId &&
        a.Outcome == BribeAttemptOutcome.Succeeded &&
        !a.WasDetected,
      cancellationToken);
  }

  private static void ApplyCleanWinGrowth(ClubPresident president, GameOptions options)
  {
    if (options.PostMatchCleanWinIntegrityGain > 0)
    {
      int before = president.Integrity;
      president.Integrity = ClubPresidentAttributeBusinessRules.ApplyAttributeGain(
        before,
        options.PostMatchCleanWinIntegrityGain);
    }

    if (options.PostMatchCleanWinCharismaGain > 0)
    {
      int before = president.Charisma;
      president.Charisma = ClubPresidentAttributeBusinessRules.ApplyAttributeGain(
        before,
        options.PostMatchCleanWinCharismaGain);
    }
  }

  private static void ApplyCunningGain(ClubPresident president, int gain)
  {
    if (gain <= 0)
    {
      return;
    }

    int before = president.Cunning;
    president.Cunning = ClubPresidentAttributeBusinessRules.ApplyAttributeGain(before, gain);
  }

  private static void ApplyIntegrityLoss(ClubPresident president, int loss)
  {
    if (loss <= 0)
    {
      return;
    }

    int before = president.Integrity;
    president.Integrity = ClubPresidentAttributeBusinessRules.ApplyAttributeLoss(before, loss);
  }

  private static bool HasAnyGrowthConfigured(GameOptions options)
  {
    return options.PostMatchCleanWinIntegrityGain > 0
      || options.PostMatchCleanWinCharismaGain > 0
      || options.PostMatchUndetectedShadyCunningGain > 0
      || options.PostMatchScandalIntegrityLoss > 0;
  }
}
