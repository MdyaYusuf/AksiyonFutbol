using Api.Core.Repositories;

namespace Api.Features.Clubs;

public interface IClubRepository : IRepository<Club, Guid>
{
  Task<Club?> GetByPresidentIdAsync(
    Guid presidentId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<Club?> GetByUserIdAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<List<Club>> GetByDivisionIdAsync(
    int divisionId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

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
