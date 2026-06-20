using Api.Core.Repositories;

namespace Api.Features.LeagueDivisions;

public interface ILeagueDivisionRepository : IRepository<LeagueDivision, int>
{
  Task<LeagueDivision?> GetByTierAndGroupAsync(
    int tier,
    int groupNumber,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<List<LeagueDivision>> GetByTierAsync(
    int tier,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<bool> IsNameUniqueAsync(
    string name,
    int? excludedId = null,
    CancellationToken cancellationToken = default);

  Task<bool> IsTierGroupUniqueAsync(
    int tier,
    int groupNumber,
    int? excludedId = null,
    CancellationToken cancellationToken = default);
}
