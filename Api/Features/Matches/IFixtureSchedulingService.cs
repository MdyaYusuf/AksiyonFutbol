namespace Api.Features.Matches;

public interface IFixtureSchedulingService
{
  /// <summary>
  /// Persists a double round-robin fixture list. Does not call SaveChanges.
  /// When <paramref name="firstKickoffLocal"/> is null, uses the next Istanbul kickoff on or after <paramref name="utcNow"/>.
  /// </summary>
  Task<int> ScheduleDoubleRoundRobinAsync(
    int divisionId,
    IReadOnlyList<Guid> orderedClubIds,
    int matchWeekCount,
    int season,
    DateTime? utcNow = null,
    DateTime? firstKickoffLocal = null,
    CancellationToken cancellationToken = default);
}
