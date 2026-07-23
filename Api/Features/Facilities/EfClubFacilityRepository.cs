using Api.Data;
using Api.Core.Repositories;

namespace Api.Features.Facilities;

public class EfClubFacilityRepository : EfBaseRepository<BaseDbContext, ClubFacility, Guid>, IClubFacilityRepository
{
  public EfClubFacilityRepository(BaseDbContext context) : base(context)
  {
  }
}
