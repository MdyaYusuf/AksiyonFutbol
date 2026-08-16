using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.BaseBotClubs;

public interface IBaseBotClubRepository : IRepository<BaseBotClub, Guid>
{
}

public class EfBaseBotClubRepository : EfBaseRepository<BaseDbContext, BaseBotClub, Guid>, IBaseBotClubRepository
{
  public EfBaseBotClubRepository(BaseDbContext context) : base(context)
  {
  }
}
