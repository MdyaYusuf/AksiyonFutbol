using Api.Core.Repositories;

namespace Api.Features.ClubPresidents;

public interface IClubPresidentRepository : IRepository<ClubPresident, Guid>
{
  Task<ClubPresident?> GetByUserIdAsync(
    Guid userId,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<bool> IsNameUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default);

  Task<bool> UserHasPresidentAsync(
    Guid userId,
    CancellationToken cancellationToken = default);
}
