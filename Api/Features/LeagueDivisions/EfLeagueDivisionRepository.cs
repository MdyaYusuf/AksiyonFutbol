using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.LeagueDivisions;

public class EfLeagueDivisionRepository : EfBaseRepository<BaseDbContext, LeagueDivision, int>, ILeagueDivisionRepository
{
  public EfLeagueDivisionRepository(BaseDbContext context) : base(context)
  {
  }

  public async Task<bool> IsNameUniqueAsync(
    string name,
    int? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return !await Query(enableTracking: false)
      .AnyAsync(ld => ld.Name == name && (excludedId == null || ld.Id != excludedId), cancellationToken);
  }

  public async Task<bool> IsTierGroupUniqueAsync(
    int tier,
    int groupNumber,
    int? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return !await Query(enableTracking: false)
      .AnyAsync(ld => ld.Tier == tier && ld.GroupNumber == groupNumber && (excludedId == null || ld.Id != excludedId), cancellationToken);
  }
}
