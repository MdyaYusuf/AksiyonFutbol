using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.PlayerInstances;

public class EfPlayerInstanceRepository : EfBaseRepository<BaseDbContext, PlayerInstance, Guid>, IPlayerInstanceRepository
{
  public EfPlayerInstanceRepository(BaseDbContext context) : base(context)
  {
  }

  public async Task<int> CountByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .CountAsync(pi => pi.ClubId == clubId, cancellationToken);
  }
}
