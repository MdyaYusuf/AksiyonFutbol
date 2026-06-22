using Api.Core.Exceptions;
using Api.Features.BasePlayers;
using Api.Features.Clubs;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.PlayerInstances;

public class PlayerInstanceBusinessRules(
  IPlayerInstanceRepository _playerInstanceRepository,
  IClubRepository _clubRepository,
  IBasePlayerRepository _basePlayerRepository)
{
  public async Task<PlayerInstance> GetPlayerInstanceIfExistAsync(
    Guid id,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    PlayerInstance? playerInstance = await _playerInstanceRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (playerInstance == null)
    {
      throw new NotFoundException($"{id} numaralı oyuncu bulunamadı.");
    }

    return playerInstance;
  }

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
    Club? club = await _clubRepository.GetByUserIdAsync(userId, include, enableTracking, cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<BasePlayer> GetBasePlayerIfExistAsync(
    Guid basePlayerId,
    CancellationToken cancellationToken = default)
  {
    BasePlayer? basePlayer = await _basePlayerRepository.GetByIdAsync(basePlayerId, cancellationToken: cancellationToken);

    if (basePlayer == null)
    {
      throw new NotFoundException($"{basePlayerId} numaralı oyuncu şablonu bulunamadı.");
    }

    return basePlayer;
  }

  public void ClubMustBelongToCurrentUserOrAdmin(Club club, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    if (club.President == null || club.President.UserId != currentUserId)
    {
      throw new ForbiddenException("Bu kulübün oyuncuları üzerinde işlem yapma yetkiniz bulunmamaktadır.");
    }
  }

  public async Task PlayerMustBelongToCurrentUserOrAdmin(
    PlayerInstance playerInstance,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    if (userRole == "Admin")
    {
      return;
    }

    Club? club = playerInstance.Club;

    if (club?.President == null)
    {
      club = await GetClubIfExistAsync(
        playerInstance.ClubId,
        include: query => query.Include(c => c.President),
        cancellationToken: cancellationToken);
    }

    ClubMustBelongToCurrentUserOrAdmin(club, currentUserId, userRole);
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Oyuncu yönetimi için yetkiniz bulunmamaktadır.");
    }
  }
}
