using Api.Core.Repositories;

namespace Api.Features.PlayerInstances;

public interface IPlayerInstanceRepository : IRepository<PlayerInstance, Guid>
{
  Task<int> CountByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);
}
