using Api.Core.Repositories;

namespace Api.Features.LeagueDivisions;

public interface ILeagueDivisionRepository : IRepository<LeagueDivision, int>
{
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
