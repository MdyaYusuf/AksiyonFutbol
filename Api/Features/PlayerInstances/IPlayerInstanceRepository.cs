using Api.Core.Repositories;

namespace Api.Features.PlayerInstances;

public interface IPlayerInstanceRepository : IRepository<PlayerInstance, Guid>
{
  Task<List<PlayerInstance>> GetByClubIdAsync(
    Guid clubId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<List<PlayerInstance>> GetByBasePlayerIdAsync(
    Guid basePlayerId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<List<PlayerInstance>> GetAvailableByClubIdAsync(
    Guid clubId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<List<PlayerInstance>> GetInjuredByClubIdAsync(
    Guid clubId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<int> CountByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);
}
