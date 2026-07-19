using Api.Core.Repositories;

namespace Api.Features.ClubPresidents;

public interface IClubPresidentRepository : IRepository<ClubPresident, Guid>
{
  Task<bool> IsNameUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default);

  Task<bool> UserHasPresidentAsync(
    Guid userId,
    CancellationToken cancellationToken = default);
}
