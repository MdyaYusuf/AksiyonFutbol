namespace Api.Features.Matches;

public interface IFixtureSchedulingService
{
  /// <summary>
  /// Persists a double round-robin fixture list. Does not call SaveChanges.
  /// </summary>
  Task<int> ScheduleDoubleRoundRobinAsync(
    int divisionId,
    IReadOnlyList<Guid> orderedClubIds,
    int matchWeekCount,
    DateTime? utcNow = null,
    CancellationToken cancellationToken = default);
}
