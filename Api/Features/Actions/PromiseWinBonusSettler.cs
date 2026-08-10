using Api.Features.Clubs;
using Api.Features.Matches;

namespace Api.Features.Actions;

/// <summary>
/// Pays out promised win bonuses after a fixture. Looks up successful PromiseWinBonus
/// ClubActions scoped to the match and deducts the pledged amount from the winning club.
/// </summary>
public interface IPromiseWinBonusSettler
{
  Task SettleAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default);
}

public class PromiseWinBonusSettler(
  IClubActionRepository _clubActionRepository) : IPromiseWinBonusSettler
{
  public async Task SettleAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default)
  {
    if (homeScore == awayScore)
    {
      return;
    }

    Guid winnerClubId = homeScore > awayScore
      ? match.HomeClubId
      : match.AwayClubId;

    Club winnerClub = homeScore > awayScore
      ? match.HomeClub
      : match.AwayClub;

    List<ClubAction> promises = await _clubActionRepository.GetAllAsync(
      filter: a =>
        a.MatchId == match.Id &&
        a.ClubId == winnerClubId &&
        a.ActionType == ClubActionType.PromiseWinBonus &&
        a.Outcome == ClubActionOutcome.Succeeded,
      cancellationToken: cancellationToken);

    if (promises.Count == 0)
    {
      return;
    }

    decimal totalPayout = promises.Sum(a => a.CashSpent);

    if (totalPayout <= 0m)
    {
      return;
    }

    winnerClub.Cash = Math.Max(0m, winnerClub.Cash - totalPayout);
  }
}
