using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using FluentValidation;

namespace Api.Features.BasePlayers;

public class BasePlayerService(
  IBasePlayerRepository _basePlayerRepository,
  BasePlayerMapper _mapper,
  BasePlayerBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateBasePlayerRequest> _createValidator,
  IValidator<UpdateBasePlayerRequest> _updateValidator) : IBasePlayerService
{
  public async Task<ReturnModel<PagedResponse<BasePlayerResponseDto>>> GetAllAsync(
    Expression<Func<BasePlayer, bool>>? filter = null,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    Func<IQueryable<BasePlayer>, IOrderedQueryable<BasePlayer>>? orderBy = null,
    int pageNumber = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var (basePlayers, totalCount) = await _basePlayerRepository.GetPagedListAsync(
      pageNumber,
      pageSize,
      filter,
      include,
      orderBy ?? (query => query.OrderBy(bp => bp.Position).ThenByDescending(bp => bp.AttackPower + bp.DefenseStrength + bp.MidfieldControl)),
      enableTracking,
      withDeleted,
      cancellationToken);

    List<BasePlayerResponseDto> responseDtos = _mapper.EntityToResponseDtoList(basePlayers);
    var pagedResponse = new PagedResponse<BasePlayerResponseDto>(responseDtos, totalCount, pageNumber, pageSize);

    return new ReturnModel<PagedResponse<BasePlayerResponseDto>>()
    {
      Success = true,
      Message = "Oyuncu şablonu listesi başarılı bir şekilde getirildi.",
      Data = pagedResponse,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<BasePlayerResponseDto>> GetAsync(
    Expression<Func<BasePlayer, bool>> predicate,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    BasePlayer? basePlayer = await _basePlayerRepository.GetAsync(
      predicate,
      include,
      enableTracking,
      cancellationToken);

    if (basePlayer == null)
    {
      return new ReturnModel<BasePlayerResponseDto>()
      {
        Success = true,
        Message = "Eşleşen oyuncu şablonu bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    BasePlayerResponseDto response = _mapper.EntityToResponseDto(basePlayer);

    return new ReturnModel<BasePlayerResponseDto>()
    {
      Success = true,
      Message = "Oyuncu şablonu başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<BasePlayerResponseDto>> GetByIdAsync(
    Guid id,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    BasePlayer basePlayer = await _businessRules.GetBasePlayerIfExistAsync(
      id,
      include,
      enableTracking,
      cancellationToken);

    BasePlayerResponseDto response = _mapper.EntityToResponseDto(basePlayer);

    return new ReturnModel<BasePlayerResponseDto>()
    {
      Success = true,
      Message = "Oyuncu şablonu başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<BasePlayerPreviewDto>>> GetByPositionAsync(
    PlayerPosition position,
    CancellationToken cancellationToken = default)
  {
    List<BasePlayer> basePlayers = await _basePlayerRepository.GetByPositionAsync(position, cancellationToken: cancellationToken);
    List<BasePlayerPreviewDto> response = _mapper.EntityToPreviewDtoList(basePlayers);

    return new ReturnModel<List<BasePlayerPreviewDto>>()
    {
      Success = true,
      Message = "Pozisyona göre oyuncu şablonları başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedBasePlayerResponseDto>> AddAsync(
    CreateBasePlayerRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.TemplateMustBeUniqueAsync(
      request.DefaultFirstName,
      request.DefaultLastName,
      request.Nationality,
      request.Position,
      request.Age,
      request.AttackPower,
      request.DefenseStrength,
      request.MidfieldControl,
      cancellationToken: cancellationToken);

    BasePlayer basePlayer = _mapper.CreateToEntity(request);

    await _basePlayerRepository.AddAsync(basePlayer, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedBasePlayerResponseDto response = _mapper.EntityToCreatedResponseDto(basePlayer);

    return new ReturnModel<CreatedBasePlayerResponseDto>()
    {
      Success = true,
      Message = "Oyuncu şablonu başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateBasePlayerRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    BasePlayer basePlayer = await _businessRules.GetBasePlayerIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.TemplateMustBeUniqueAsync(
      request.DefaultFirstName,
      request.DefaultLastName,
      request.Nationality,
      request.Position,
      request.Age,
      request.AttackPower,
      request.DefenseStrength,
      request.MidfieldControl,
      request.Id,
      cancellationToken);

    _mapper.UpdateEntityFromRequest(request, basePlayer);

    _basePlayerRepository.Update(basePlayer);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu şablonu başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    BasePlayer basePlayer = await _businessRules.GetBasePlayerIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _basePlayerRepository.Delete(basePlayer);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Oyuncu şablonu başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}
