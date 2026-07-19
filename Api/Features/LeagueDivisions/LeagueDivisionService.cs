using System.Linq.Expressions;
using Api.Core.Helpers;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using FluentValidation;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Options;

namespace Api.Features.LeagueDivisions;

public class LeagueDivisionService(
  ILeagueDivisionRepository _leagueDivisionRepository,
  LeagueDivisionMapper _mapper,
  LeagueDivisionBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateLeagueDivisionRequest> _createValidator,
  IValidator<UpdateLeagueDivisionRequest> _updateValidator,
  IValidator<UpdateLeagueDivisionMatchWeekRequest> _updateMatchWeekValidator,
  IOptions<GameOptions> _gameOptions,
  HybridCache _cache) : ILeagueDivisionService
{
  private const string CacheTag = "league-divisions";

  public async Task<ReturnModel<PagedResponse<LeagueDivisionResponseDto>>> GetAllAsync(
    Expression<Func<LeagueDivision, bool>>? filter = null,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    Func<IQueryable<LeagueDivision>, IOrderedQueryable<LeagueDivision>>? orderBy = null,
    int pageNumber = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    PagedResponse<LeagueDivisionResponseDto> pagedResponse;

    if (CacheQueryHelper.CanUseDefaultCache<LeagueDivision, int>(filter, include, orderBy, enableTracking, withDeleted))
    {
      pagedResponse = await _cache.GetOrCreateAsync(
        $"league-divisions:page:{pageNumber}:size:{pageSize}",
        async token => await GetPagedLeagueDivisionsAsync(pageNumber, pageSize, token),
        tags: [CacheTag],
        cancellationToken: cancellationToken);
    }
    else
    {
      var (leagueDivisions, totalCount) = await _leagueDivisionRepository.GetPagedListAsync(
        pageNumber,
        pageSize,
        filter,
        include,
        orderBy ?? (query => query.OrderBy(ld => ld.Tier).ThenBy(ld => ld.GroupNumber)),
        enableTracking,
        withDeleted,
        cancellationToken);

      List<LeagueDivisionResponseDto> responseDtos = _mapper.EntityToResponseDtoList(leagueDivisions);
      pagedResponse = new PagedResponse<LeagueDivisionResponseDto>(responseDtos, totalCount, pageNumber, pageSize);
    }

    return new ReturnModel<PagedResponse<LeagueDivisionResponseDto>>()
    {
      Success = true,
      Message = "Lig listesi başarılı bir şekilde getirildi.",
      Data = pagedResponse,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<LeagueDivisionResponseDto>> GetAsync(
    Expression<Func<LeagueDivision, bool>> predicate,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? leagueDivision = await _leagueDivisionRepository.GetAsync(
      predicate,
      include,
      enableTracking,
      cancellationToken);

    if (leagueDivision == null)
    {
      return new ReturnModel<LeagueDivisionResponseDto>()
      {
        Success = true,
        Message = "Eşleşen lig bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    LeagueDivisionResponseDto response = _mapper.EntityToResponseDto(leagueDivision);

    return new ReturnModel<LeagueDivisionResponseDto>()
    {
      Success = true,
      Message = "Lig bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<LeagueDivisionResponseDto>> GetByIdAsync(
    int id,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    LeagueDivisionResponseDto response;

    if (include == null && !enableTracking)
    {
      response = await _cache.GetOrCreateAsync(
        $"league-divisions:id:{id}",
        async token =>
        {
          LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionIfExistAsync(
            id,
            cancellationToken: token);

          return _mapper.EntityToResponseDto(leagueDivision);
        },
        tags: [CacheTag],
        cancellationToken: cancellationToken);
    }
    else
    {
      LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionIfExistAsync(
        id,
        include,
        enableTracking,
        cancellationToken);

      response = _mapper.EntityToResponseDto(leagueDivision);
    }

    return new ReturnModel<LeagueDivisionResponseDto>()
    {
      Success = true,
      Message = "Lig bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<LeagueDivisionPreviewDto>>> GetByTierAsync(
    int tier,
    CancellationToken cancellationToken = default)
  {
    List<LeagueDivisionPreviewDto> response = await _cache.GetOrCreateAsync(
      $"league-divisions:tier:{tier}",
      async token =>
      {
        List<LeagueDivision> leagueDivisions = await _leagueDivisionRepository.GetAllAsync(
          filter: ld => ld.Tier == tier,
          orderBy: query => query.OrderBy(ld => ld.GroupNumber),
          cancellationToken: token);
        return _mapper.EntityToPreviewDtoList(leagueDivisions);
      },
      tags: [CacheTag],
      cancellationToken: cancellationToken);

    return new ReturnModel<List<LeagueDivisionPreviewDto>>()
    {
      Success = true,
      Message = $"{tier}. seviye ligleri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<LeagueDivisionResponseDto>> GetByTierAndGroupAsync(
    int tier,
    int groupNumber,
    CancellationToken cancellationToken = default)
  {
    LeagueDivisionResponseDto response = await _cache.GetOrCreateAsync(
      $"league-divisions:tier:{tier}:group:{groupNumber}",
      async token =>
      {
        LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionByTierAndGroupIfExistAsync(
          tier,
          groupNumber,
          cancellationToken: token);

        return _mapper.EntityToResponseDto(leagueDivision);
      },
      tags: [CacheTag],
      cancellationToken: cancellationToken);

    return new ReturnModel<LeagueDivisionResponseDto>()
    {
      Success = true,
      Message = "Lig bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedLeagueDivisionResponseDto>> AddAsync(
    CreateLeagueDivisionRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.NameMustBeUniqueAsync(request.Name, cancellationToken: cancellationToken);
    await _businessRules.TierGroupMustBeUniqueAsync(request.Tier, request.GroupNumber, cancellationToken: cancellationToken);

    LeagueDivision leagueDivision = _mapper.CreateToEntity(request);
    leagueDivision.CurrentMatchWeek = _gameOptions.Value.MinimumMatchWeek;

    await _leagueDivisionRepository.AddAsync(leagueDivision, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(CacheTag, cancellationToken);

    CreatedLeagueDivisionResponseDto response = _mapper.EntityToCreatedResponseDto(leagueDivision);

    return new ReturnModel<CreatedLeagueDivisionResponseDto>()
    {
      Success = true,
      Message = "Lig başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateLeagueDivisionRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.NameMustBeUniqueAsync(request.Name, request.Id, cancellationToken);
    await _businessRules.TierGroupMustBeUniqueAsync(request.Tier, request.GroupNumber, request.Id, cancellationToken);

    _mapper.UpdateEntityFromRequest(request, leagueDivision);

    _leagueDivisionRepository.Update(leagueDivision);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(CacheTag, cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Lig bilgileri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateCurrentMatchWeekAsync(
    UpdateLeagueDivisionMatchWeekRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateMatchWeekValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.MatchWeekMustBeValid(request.CurrentMatchWeek);

    leagueDivision.CurrentMatchWeek = request.CurrentMatchWeek;

    _leagueDivisionRepository.Update(leagueDivision);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(CacheTag, cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Lig maç haftası başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> AdvanceMatchWeekAsync(
    int id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.LeagueCanAdvanceMatchWeek(leagueDivision);

    leagueDivision.CurrentMatchWeek++;

    _leagueDivisionRepository.Update(leagueDivision);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(CacheTag, cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Lig bir sonraki maç haftasına taşındı.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    int id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    LeagueDivision leagueDivision = await _businessRules.GetLeagueDivisionIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _leagueDivisionRepository.Delete(leagueDivision);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(CacheTag, cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Lig başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }

  private async Task<PagedResponse<LeagueDivisionResponseDto>> GetPagedLeagueDivisionsAsync(
    int pageNumber,
    int pageSize,
    CancellationToken cancellationToken)
  {
    var (leagueDivisions, totalCount) = await _leagueDivisionRepository.GetPagedListAsync(
      pageNumber,
      pageSize,
      orderBy: query => query.OrderBy(ld => ld.Tier).ThenBy(ld => ld.GroupNumber),
      cancellationToken: cancellationToken);

    List<LeagueDivisionResponseDto> responseDtos = _mapper.EntityToResponseDtoList(leagueDivisions);
    return new PagedResponse<LeagueDivisionResponseDto>(responseDtos, totalCount, pageNumber, pageSize);
  }
}
