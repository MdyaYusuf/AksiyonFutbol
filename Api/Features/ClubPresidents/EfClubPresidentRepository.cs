using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.ClubPresidents;

public class EfClubPresidentRepository : EfBaseRepository<BaseDbContext, ClubPresident, Guid>, IClubPresidentRepository
{
  public EfClubPresidentRepository(BaseDbContext context) : base(context)
  {

  }

  public async Task<ClubPresident?> GetByUserIdAsync(
    Guid userId,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<ClubPresident> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query.FirstOrDefaultAsync(cp => cp.UserId == userId, cancellationToken);
  }

  public async Task<bool> IsNameUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return !await Query(enableTracking: false)
      .AnyAsync(cp => cp.Name == name && (excludedId == null || cp.Id != excludedId), cancellationToken);
  }

  public async Task<bool> UserHasPresidentAsync(
    Guid userId,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .AnyAsync(cp => cp.UserId == userId, cancellationToken);
  }
}
