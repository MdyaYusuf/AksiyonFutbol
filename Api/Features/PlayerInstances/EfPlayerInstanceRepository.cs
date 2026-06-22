using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.PlayerInstances;

public class EfPlayerInstanceRepository : EfBaseRepository<BaseDbContext, PlayerInstance, Guid>, IPlayerInstanceRepository
{
  public EfPlayerInstanceRepository(BaseDbContext context) : base(context)
  {

  }

  public async Task<List<PlayerInstance>> GetByClubIdAsync(
    Guid clubId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<PlayerInstance> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query
      .Where(pi => pi.ClubId == clubId)
      .OrderBy(pi => pi.Position)
      .ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl)
      .ToListAsync(cancellationToken);
  }

  public async Task<List<PlayerInstance>> GetByBasePlayerIdAsync(
    Guid basePlayerId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<PlayerInstance> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query
      .Where(pi => pi.BasePlayerId == basePlayerId)
      .OrderBy(pi => pi.Club.Name)
      .ThenBy(pi => pi.Position)
      .ToListAsync(cancellationToken);
  }

  public async Task<List<PlayerInstance>> GetAvailableByClubIdAsync(
    Guid clubId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<PlayerInstance> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query
      .Where(pi => pi.ClubId == clubId && !pi.IsInjured)
      .OrderBy(pi => pi.Position)
      .ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl)
      .ToListAsync(cancellationToken);
  }

  public async Task<List<PlayerInstance>> GetInjuredByClubIdAsync(
    Guid clubId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<PlayerInstance> query = Query(enableTracking);

    if (include != null)
    {
      query = include(query);
    }

    return await query
      .Where(pi => pi.ClubId == clubId && pi.IsInjured)
      .OrderByDescending(pi => pi.InjuryDays)
      .ThenBy(pi => pi.Position)
      .ToListAsync(cancellationToken);
  }

  public async Task<int> CountByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    return await Query(enableTracking: false)
      .CountAsync(pi => pi.ClubId == clubId, cancellationToken);
  }
}
