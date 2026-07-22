using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Bribery;

public class EfBribeAttemptRepository : EfBaseRepository<BaseDbContext, BribeAttempt, Guid>, IBribeAttemptRepository
{
  public EfBribeAttemptRepository(BaseDbContext context) : base(context)
  {
  }
}
