using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.ClubLineups;

public class EfClubLineupRepository : EfBaseRepository<BaseDbContext, ClubLineup, Guid>, IClubLineupRepository
{
  public EfClubLineupRepository(BaseDbContext context) : base(context)
  {
  }
}
