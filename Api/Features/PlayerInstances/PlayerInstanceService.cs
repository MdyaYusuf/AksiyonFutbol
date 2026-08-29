using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.BasePlayers;
using Api.Features.Clubs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.PlayerInstances;

public class PlayerInstanceService(
  IPlayerInstanceRepository _playerInstanceRepository,
  PlayerInstanceMapper _mapper,
  PlayerInstanceBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreatePlayerInstanceFromBasePlayerRequest> _createFromBaseValidator,
  IValidator<CreateCustomPlayerInstanceRequest> _createCustomValidator,
  IValidator<UpdatePlayerInstanceNameRequest> _updateNameValidator,
  IValidator<UpdatePlayerInstanceStatsRequest> _updateStatsValidator,
  IValidator<UpdatePlayerInstanceHealthRequest> _updateHealthValidator,
  IValidator<UpdatePlayerInstanceSeasonStatsRequest> _updateSeasonStatsValidator) : IPlayerInstanceService
{
  public Task<ReturnModel<PagedResponse<PlayerInstanceResponseDto>>> GetAllAsync(
    PlayerInstanceListQuery query,
    CancellationToken cancellationToken = default)
  {
    return GetAllAsync(
      filter: BuildListFilter(query),
      currentPage: query.CurrentPage,
      pageSize: query.PageSize,
      cancellationToken: cancellationToken);
  }

  public async Task<ReturnModel<PagedResponse<PlayerInstanceResponseDto>>> GetAllAsync(
    Expression<Func<PlayerInstance, bool>>? filter = null,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    Func<IQueryable<PlayerInstance>, IOrderedQueryable<PlayerInstance>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var (players, totalCount) = await _playerInstanceRepository.GetPagedListAsync(
      currentPage,
      pageSize,
      filter,
      include: include ?? IncludePlayerRelations,
      orderBy ?? (query => query.OrderBy(pi => pi.Club.DisplayName).ThenBy(pi => pi.Position).ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl)),
      enableTracking,
      withDeleted,
      cancellationToken);

    List<PlayerInstanceResponseDto> responseDtos = _mapper.EntityToResponseDtoList(players);
    var pagedResponse = new PagedResponse<PlayerInstanceResponseDto>(responseDtos, totalCount, currentPage, pageSize);

    return new ReturnModel<PagedResponse<PlayerInstanceResponseDto>>()
    {
      Success = true,
      Message = "Oyuncu listesi başarılı bir şekilde getirildi.",
      Data = pagedResponse,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<PlayerInstanceResponseDto>> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
  {
    PlayerInstance player = await _businessRules.GetPlayerInstanceIfExistAsync(
      id,
      include: IncludePlayerRelations,
      cancellationToken: cancellationToken);

    PlayerInstanceResponseDto response = _mapper.EntityToResponseDto(player);

    return new ReturnModel<PlayerInstanceResponseDto>()
    {
      Success = true,
      Message = "Oyuncu bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<PlayerInstancePreviewDto>>> GetByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.GetClubIfExistAsync(clubId, cancellationToken: cancellationToken);

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId,
      include: IncludePlayerRelations,
      orderBy: query => query
        .OrderBy(pi => pi.Position)
        .ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl),
      cancellationToken: cancellationToken);

    List<PlayerInstancePreviewDto> response = _mapper.EntityToPreviewDtoList(players);

    return new ReturnModel<List<PlayerInstancePreviewDto>>()
    {
      Success = true,
      Message = "Kulüp oyuncuları başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<PlayerInstanceResponseDto>>> GetCurrentUserClubPlayersAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(currentUserId, cancellationToken: cancellationToken);

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == club.Id,
      include: IncludePlayerRelations,
      orderBy: query => query
        .OrderBy(pi => pi.Position)
        .ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl),
      cancellationToken: cancellationToken);

    List<PlayerInstanceResponseDto> response = _mapper.EntityToResponseDtoList(players);

    return new ReturnModel<List<PlayerInstanceResponseDto>>()
    {
      Success = true,
      Message = "Kulübünüzün oyuncuları başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<PlayerInstancePreviewDto>>> GetAvailableByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.GetClubIfExistAsync(clubId, cancellationToken: cancellationToken);

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId && !pi.IsInjured,
      include: IncludePlayerRelations,
      orderBy: query => query
        .OrderBy(pi => pi.Position)
        .ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl),
      cancellationToken: cancellationToken);

    List<PlayerInstancePreviewDto> response = _mapper.EntityToPreviewDtoList(players);

    return new ReturnModel<List<PlayerInstancePreviewDto>>()
    {
      Success = true,
      Message = "Oynayabilecek oyuncular başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<PlayerInstancePreviewDto>>> GetInjuredByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.GetClubIfExistAsync(clubId, cancellationToken: cancellationToken);

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId && pi.IsInjured,
      include: IncludePlayerRelations,
      orderBy: query => query
        .OrderByDescending(pi => pi.InjuryDays)
        .ThenBy(pi => pi.Position),
      cancellationToken: cancellationToken);

    List<PlayerInstancePreviewDto> response = _mapper.EntityToPreviewDtoList(players);

    return new ReturnModel<List<PlayerInstancePreviewDto>>()
    {
      Success = true,
      Message = "Sakat oyuncular başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedPlayerInstanceResponseDto>> AddFromBasePlayerAsync(
    CreatePlayerInstanceFromBasePlayerRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _createFromBaseValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.GetClubIfExistAsync(request.ClubId, cancellationToken: cancellationToken);
    BasePlayer basePlayer = await _businessRules.GetBasePlayerIfExistAsync(request.BasePlayerId, cancellationToken);

    PlayerInstance player = PlayerInstanceFromBasePlayer.Create(
      request.ClubId,
      basePlayer,
      request.MarketValue,
      request.Wage);

    await _playerInstanceRepository.AddAsync(player, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    var response = new CreatedPlayerInstanceResponseDto
    {
      Id = player.Id,
      FirstName = player.FirstName,
      LastName = player.LastName,
      Position = player.Position,
      ClubId = player.ClubId
    };

    return new ReturnModel<CreatedPlayerInstanceResponseDto>()
    {
      Success = true,
      Message = "Oyuncu başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<CreatedPlayerInstanceResponseDto>> AddCustomAsync(
    CreateCustomPlayerInstanceRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _createCustomValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.GetClubIfExistAsync(request.ClubId, cancellationToken: cancellationToken);

    PlayerInstance player = _mapper.CreateCustomToEntity(request);
    player.BasePlayerId = null;
    player.IsInjured = false;
    player.InjuryDays = 0;

    await _playerInstanceRepository.AddAsync(player, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedPlayerInstanceResponseDto response = _mapper.EntityToCreatedResponseDto(player);

    return new ReturnModel<CreatedPlayerInstanceResponseDto>()
    {
      Success = true,
      Message = "Özel oyuncu başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateNameAsync(
    UpdatePlayerInstanceNameRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateNameValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    PlayerInstance player = await _businessRules.GetPlayerInstanceIfExistAsync(
      request.Id,
      include: IncludePlayerOwnerRelations,
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.PlayerMustBelongToCurrentUserOrAdmin(player, currentUserId, userRole, cancellationToken);

    _mapper.UpdateEntityFromNameRequest(request, player);

    _playerInstanceRepository.Update(player);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu adı başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateStatsAsync(
    UpdatePlayerInstanceStatsRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateStatsValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    PlayerInstance player = await _businessRules.GetPlayerInstanceIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _mapper.UpdateEntityFromStatsRequest(request, player);

    _playerInstanceRepository.Update(player);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu özellikleri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateHealthAsync(
    UpdatePlayerInstanceHealthRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateHealthValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    PlayerInstance player = await _businessRules.GetPlayerInstanceIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _mapper.UpdateEntityFromHealthRequest(request, player);

    _playerInstanceRepository.Update(player);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu sağlık durumu başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateSeasonStatsAsync(
    UpdatePlayerInstanceSeasonStatsRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateSeasonStatsValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    PlayerInstance player = await _businessRules.GetPlayerInstanceIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _mapper.UpdateEntityFromSeasonStatsRequest(request, player);

    _playerInstanceRepository.Update(player);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu sezon istatistikleri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    PlayerInstance player = await _businessRules.GetPlayerInstanceIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _playerInstanceRepository.Delete(player);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }

  private static Expression<Func<PlayerInstance, bool>>? BuildListFilter(PlayerInstanceListQuery query)
  {
    string? trimmedSearch = query.Search?.Trim();
    bool hasSearch = !string.IsNullOrWhiteSpace(trimmedSearch);
    bool hasClubId = query.ClubId.HasValue;
    bool hasPosition = query.Position.HasValue;
    bool hasIsInjured = query.IsInjured.HasValue;

    if (!hasSearch && !hasClubId && !hasPosition && !hasIsInjured)
    {
      return null;
    }

    string term = trimmedSearch ?? string.Empty;
    Guid clubId = query.ClubId ?? Guid.Empty;
    PlayerPosition position = query.Position ?? default;
    bool isInjured = query.IsInjured ?? false;

    return pi =>
      (!hasClubId || pi.ClubId == clubId)
      && (!hasPosition || pi.Position == position)
      && (!hasIsInjured || pi.IsInjured == isInjured)
      && (!hasSearch
        || pi.FirstName.Contains(term)
        || pi.LastName.Contains(term)
        || (pi.Club != null
          && (pi.Club.DisplayName.Contains(term) || pi.Club.Name.Contains(term))));
  }

  private static IQueryable<PlayerInstance> IncludePlayerRelations(IQueryable<PlayerInstance> query)
  {
    return query.Include(pi => pi.Club)
      .Include(pi => pi.BasePlayer);
  }

  private static IQueryable<PlayerInstance> IncludePlayerOwnerRelations(IQueryable<PlayerInstance> query)
  {
    return query.Include(pi => pi.Club)
      .ThenInclude(c => c.President)
      .Include(pi => pi.BasePlayer);
  }
}
