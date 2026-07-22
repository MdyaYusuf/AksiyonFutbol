using Api.Core.Repositories;

namespace Api.Features.Bribery;

public interface IBribeAttemptRepository : IRepository<BribeAttempt, Guid>
{
}
