using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Objectives;

public class EfClubObjectiveProgressRepository
  : EfBaseRepository<BaseDbContext, ClubObjectiveProgress, Guid>, IClubObjectiveProgressRepository
{
  public EfClubObjectiveProgressRepository(BaseDbContext context) : base(context)
  {
  }
}

public class EfPresidentTitleUnlockRepository
  : EfBaseRepository<BaseDbContext, PresidentTitleUnlock, Guid>, IPresidentTitleUnlockRepository
{
  public EfPresidentTitleUnlockRepository(BaseDbContext context) : base(context)
  {
  }
}
