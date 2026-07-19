using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Matches;

public class EfMatchRepository : EfBaseRepository<BaseDbContext, Match, Guid>, IMatchRepository
{
  public EfMatchRepository(BaseDbContext context) : base(context)
  {
  }

  public async Task<List<Match>> GetScheduledUnplayedAsync(
    DateTime utcNow,
    int count,
    Func<IQueryable<Match>, IQueryable<Match>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Match> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query
      .Where(m => !m.IsPlayed && m.MatchDate <= utcNow)
      .OrderBy(m => m.MatchDate)
      .Take(count)
      .ToListAsync(cancellationToken);
  }

  public async Task<bool> FixtureExistsAsync(
    int divisionId,
    int matchWeek,
    Guid homeClubId,
    Guid awayClubId,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .AnyAsync(m =>
        m.DivisionId == divisionId &&
        m.MatchWeek == matchWeek &&
        m.HomeClubId == homeClubId &&
        m.AwayClubId == awayClubId &&
        (excludedId == null || m.Id != excludedId),
        cancellationToken);
  }
}
