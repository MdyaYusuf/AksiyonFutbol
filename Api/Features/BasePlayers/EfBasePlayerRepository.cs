using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.BasePlayers;

public class EfBasePlayerRepository : EfBaseRepository<BaseDbContext, BasePlayer, Guid>, IBasePlayerRepository
{
  public EfBasePlayerRepository(BaseDbContext context) : base(context)
  {
  }

  public async Task<bool> TemplateExistsAsync(
    string defaultFirstName,
    string defaultLastName,
    string? nationality,
    PlayerPosition position,
    int age,
    int heightCm,
    int weightKg,
    PreferredFoot preferredFoot,
    int attackPower,
    int defenseStrength,
    int midfieldControl,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .AnyAsync(bp =>
        bp.DefaultFirstName == defaultFirstName &&
        bp.DefaultLastName == defaultLastName &&
        bp.Nationality == nationality &&
        bp.Position == position &&
        bp.Age == age &&
        bp.HeightCm == heightCm &&
        bp.WeightKg == weightKg &&
        bp.PreferredFoot == preferredFoot &&
        bp.AttackPower == attackPower &&
        bp.DefenseStrength == defenseStrength &&
        bp.MidfieldControl == midfieldControl &&
        (excludedId == null || bp.Id != excludedId),
        cancellationToken);
  }
}
