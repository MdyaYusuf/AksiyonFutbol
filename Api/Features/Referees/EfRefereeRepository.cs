using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Referees;

public class EfRefereeRepository : EfBaseRepository<BaseDbContext, Referee, int>, IRefereeRepository
{
  public EfRefereeRepository(BaseDbContext context) : base(context)
  {

  }

  public async Task<List<Referee>> GetByPersonalityTypeAsync(
    RefereePersonalityType personalityType,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking)
      .Where(r => r.PersonalityType == personalityType)
      .OrderBy(r => r.Name)
      .ToListAsync(cancellationToken);
  }

  public async Task<List<Referee>> GetEasiestToBribeAsync(
    int count,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking)
      .OrderBy(r => r.BriberyDifficulty)
      .ThenBy(r => r.Name)
      .Take(count)
      .ToListAsync(cancellationToken);
  }

  public async Task<bool> IsNameUniqueAsync(
    string name,
    int? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return !await Query(enableTracking: false)
      .AnyAsync(r => r.Name == name && (excludedId == null || r.Id != excludedId), cancellationToken);
  }
}
