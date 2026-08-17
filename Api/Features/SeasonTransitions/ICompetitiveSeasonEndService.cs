using Api.Features.Matches;

namespace Api.Features.SeasonTransitions;

public interface ICompetitiveSeasonEndService
{
  /// <summary>
  /// When the last competitive fixture in a group ladder is played, applies promo/releg
  /// and regenerates next-season fixtures. Does not call SaveChanges.
  /// </summary>
  Task TryProcessAfterMatchAsync(Match match, CancellationToken cancellationToken = default);

  /// <summary>
  /// Scans all competitive group ladders and applies season end where ready.
  /// </summary>
  Task<int> ProcessReadyGroupsAsync(CancellationToken cancellationToken = default);
}
