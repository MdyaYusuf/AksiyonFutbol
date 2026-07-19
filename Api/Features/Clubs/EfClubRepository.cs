using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Clubs;

public class EfClubRepository : EfBaseRepository<BaseDbContext, Club, Guid>, IClubRepository
{
  public EfClubRepository(BaseDbContext context) : base(context)
  {
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
