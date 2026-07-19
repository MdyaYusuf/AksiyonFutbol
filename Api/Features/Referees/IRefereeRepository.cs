using Api.Core.Repositories;

namespace Api.Features.Referees;

public interface IRefereeRepository : IRepository<Referee, int>
{
  Task<List<Referee>> GetEasiestToBribeAsync(
    int count,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<bool> IsNameUniqueAsync(
    string name,
    int? excludedId = null,
    CancellationToken cancellationToken = default);
}
