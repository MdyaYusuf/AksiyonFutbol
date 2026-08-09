using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Actions;

public class EfClubActionRepository : EfBaseRepository<BaseDbContext, ClubAction, Guid>, IClubActionRepository
{
  public EfClubActionRepository(BaseDbContext context) : base(context)
  {
  }
}
