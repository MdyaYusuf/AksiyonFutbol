using Api.Core.Repositories;

namespace Api.Features.Clubs;

public interface IClubRepository : IRepository<Club, Guid>
{
  Task<int> CountByDivisionIdAsync(
    int divisionId,
    CancellationToken cancellationToken = default);

  Task<bool> IsNameUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default);

  Task<bool> PresidentHasClubAsync(
    Guid presidentId,
    CancellationToken cancellationToken = default);
}
