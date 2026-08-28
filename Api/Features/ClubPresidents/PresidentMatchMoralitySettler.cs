using Api.Core.Options;
using Api.Features.Actions;
using Api.Features.Bribery;
using Api.Features.Clubs;
using Api.Features.Matches;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubPresidents;

/// <summary>
/// Awards Legitimacy after a clean competitive win at match settlement.
/// </summary>
public interface IPresidentMatchMoralitySettler
{
  Task SettleAfterMatchAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default);
}

public class PresidentMatchMoralitySettler(
  IClubActionRepository _clubActionRepository,
  IBribeAttemptRepository _bribeAttemptRepository,
  IPresidentMoralitySettler _moralitySettler,
  IOptions<GameOptions> _gameOptions) : IPresidentMatchMoralitySettler
{
  public async Task SettleAfterMatchAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default)
  {
    if (homeScore == awayScore)
    {
      return;
    }

    GameOptions options = _gameOptions.Value;

    if (options.CleanWinLegitimacyGain <= 0)
    {
      return;
    }

    Guid winnerClubId = homeScore > awayScore
      ? match.HomeClubId
      : match.AwayClubId;

    Club winnerClub = homeScore > awayScore
      ? match.HomeClub
      : match.AwayClub;

    if (winnerClub.President == null || winnerClub.IsBot)
    {
      return;
    }

    bool hadDetectedScandal = await _clubActionRepository.AnyAsync(
      a =>
        a.MatchId == match.Id &&
        a.ClubId == winnerClubId &&
        a.WasDetected,
      cancellationToken);

    if (!hadDetectedScandal)
    {
      hadDetectedScandal = await _bribeAttemptRepository.AnyAsync(
        a =>
          a.MatchId == match.Id &&
          a.ClubId == winnerClubId &&
          a.WasDetected,
        cancellationToken);
    }

    if (hadDetectedScandal)
    {
      return;
    }

    _moralitySettler.ApplyLegitimacyGain(
      winnerClub.President,
      options.CleanWinLegitimacyGain);
  }
}
