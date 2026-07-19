using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.ClubLineups;

public class EfClubLineupSelectionRepository
  : EfBaseRepository<BaseDbContext, ClubLineupSelection, Guid>,
    IClubLineupSelectionRepository
{
  public EfClubLineupSelectionRepository(BaseDbContext context) : base(context)
  {
  }
}
