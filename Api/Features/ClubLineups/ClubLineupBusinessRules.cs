using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubLineups;

public class ClubLineupBusinessRules(
  IClubRepository _clubRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IOptions<GameOptions> _gameOptions)
{
  public async Task<Club> GetClubIfExistAsync(
    Guid clubId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetByIdAsync(clubId, include, enableTracking, cancellationToken);

    if (club == null)
    {
      throw new NotFoundException($"{clubId} numaralı kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      include,
      enableTracking,
      cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public void ClubMustBelongToCurrentUserOrAdmin(Club club, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    if (club.President == null || club.President.UserId != currentUserId)
    {
      throw new ForbiddenException("Bu kulübün dizilişini yönetme yetkiniz bulunmamaktadır.");
    }
  }

  public async Task ValidatePlayersBelongToClubAsync(
    Guid clubId,
    IReadOnlyCollection<Guid> playerIds,
    CancellationToken cancellationToken = default)
  {
    if (playerIds.Count == 0)
    {
      return;
    }

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId,
      cancellationToken: cancellationToken);

    HashSet<Guid> clubPlayerIds = players.Select(p => p.Id).ToHashSet();
    List<Guid> missing = playerIds.Where(id => !clubPlayerIds.Contains(id)).ToList();

    if (missing.Count > 0)
    {
      throw new BusinessException("Seçilen oyuncuların tamamı bu kulübe ait olmalıdır.");
    }
  }

  public void StartersMustIncludeGoalkeeper(
    IReadOnlyCollection<Guid> starterIds,
    IReadOnlyDictionary<Guid, PlayerInstance> playersById)
  {
    bool hasGoalkeeper = starterIds.Any(id =>
      playersById.TryGetValue(id, out PlayerInstance? player) &&
      player.Position == PlayerPosition.Goalkeeper);

    if (!hasGoalkeeper)
    {
      throw new BusinessException("İlk 11'de en az bir kaleci olmalıdır.");
    }
  }

  public void StartersShouldNotBeInjured(
    IReadOnlyCollection<Guid> starterIds,
    IReadOnlyDictionary<Guid, PlayerInstance> playersById)
  {
    bool hasInjuredStarter = starterIds.Any(id =>
      playersById.TryGetValue(id, out PlayerInstance? player) &&
      player.IsInjured);

    if (hasInjuredStarter)
    {
      throw new BusinessException("Sakat oyuncular ilk 11'e yazılamaz.");
    }
  }

  public int StarterCount => _gameOptions.Value.LineupStarterCount;
  public int MaxBenchSize => _gameOptions.Value.LineupMaxBenchSize;
}
