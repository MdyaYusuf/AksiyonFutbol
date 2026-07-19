using Api.Core.Repositories;

namespace Api.Features.Matches;

public interface IMatchRepository : IRepository<Match, Guid>
{
  Task<List<Match>> GetScheduledUnplayedAsync(
    DateTime utcNow,
    int count,
    Func<IQueryable<Match>, IQueryable<Match>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<bool> FixtureExistsAsync(
    int divisionId,
    int matchWeek,
    Guid homeClubId,
    Guid awayClubId,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default);
}
