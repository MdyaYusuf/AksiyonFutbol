using Api.Features.Matches;

namespace Api.Features.LeagueDivisions;

public interface IMatchWeekProgressService
{
  /// <summary>
  /// When every fixture for the match's week is played and the division is still on that week,
  /// advances <see cref="LeagueDivision.CurrentMatchWeek"/> by one (capped by MaximumMatchWeek).
  /// </summary>
  Task<bool> TryAdvanceAfterMatchAsync(
    Match match,
    CancellationToken cancellationToken = default);

  /// <summary>
  /// Advances the division when every fixture for <paramref name="completedMatchWeek"/> is played
  /// and <see cref="LeagueDivision.CurrentMatchWeek"/> still equals that week.
  /// </summary>
  Task<bool> TryAdvanceIfWeekCompleteAsync(
    int divisionId,
    int season,
    int completedMatchWeek,
    CancellationToken cancellationToken = default);
}
