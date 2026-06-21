using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Clubs;

public class EfClubRepository : EfBaseRepository<BaseDbContext, Club, Guid>, IClubRepository
{
  public EfClubRepository(BaseDbContext context) : base(context)
  {

  }

  public async Task<Club?> GetByPresidentIdAsync(
    Guid presidentId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Club> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query.FirstOrDefaultAsync(c => c.PresidentId == presidentId, cancellationToken);
  }

  public async Task<Club?> GetByUserIdAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Club> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query.FirstOrDefaultAsync(c => c.President != null && c.President.UserId == userId, cancellationToken);
  }

  public async Task<List<Club>> GetByDivisionIdAsync(
    int divisionId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Club> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query
      .Where(c => c.DivisionId == divisionId)
      .OrderBy(c => c.Name)
      .ToListAsync(cancellationToken);
  }

  public async Task<int> CountByDivisionIdAsync(
    int divisionId,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .CountAsync(c => c.DivisionId == divisionId, cancellationToken);
  }

  public async Task<bool> IsNameUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return !await Query(enableTracking: false)
      .AnyAsync(c => c.Name == name && (excludedId == null || c.Id != excludedId), cancellationToken);
  }

  public async Task<bool> PresidentHasClubAsync(
    Guid presidentId,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .AnyAsync(c => c.PresidentId == presidentId, cancellationToken);
  }
}
