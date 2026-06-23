using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using FluentValidation;

namespace Api.Features.Referees;

public class RefereeService(
  IRefereeRepository _refereeRepository,
  RefereeMapper _mapper,
  RefereeBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateRefereeRequest> _createValidator,
  IValidator<UpdateRefereeRequest> _updateValidator) : IRefereeService
{
  public async Task<ReturnModel<PagedResponse<RefereeResponseDto>>> GetAllAsync(
    Expression<Func<Referee, bool>>? filter = null,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    Func<IQueryable<Referee>, IOrderedQueryable<Referee>>? orderBy = null,
    int pageNumber = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var (referees, totalCount) = await _refereeRepository.GetPagedListAsync(
      pageNumber,
      pageSize,
      filter,
      include,
      orderBy ?? (query => query.OrderBy(r => r.Name)),
      enableTracking,
      withDeleted,
      cancellationToken);

    List<RefereeResponseDto> responseDtos = _mapper.EntityToResponseDtoList(referees);
    var pagedResponse = new PagedResponse<RefereeResponseDto>(responseDtos, totalCount, pageNumber, pageSize);

    return new ReturnModel<PagedResponse<RefereeResponseDto>>()
    {
      Success = true,
      Message = "Hakem listesi başarılı bir şekilde getirildi.",
      Data = pagedResponse,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<RefereeResponseDto>> GetAsync(
    Expression<Func<Referee, bool>> predicate,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Referee? referee = await _refereeRepository.GetAsync(predicate, include, enableTracking, cancellationToken);

    if (referee == null)
    {
      return new ReturnModel<RefereeResponseDto>()
      {
        Success = true,
        Message = "Eşleşen hakem bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    RefereeResponseDto response = _mapper.EntityToResponseDto(referee);

    return new ReturnModel<RefereeResponseDto>()
    {
      Success = true,
      Message = "Hakem bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<RefereeResponseDto>> GetByIdAsync(
    int id,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Referee referee = await _businessRules.GetRefereeIfExistAsync(
      id,
      include,
      enableTracking,
      cancellationToken);

    RefereeResponseDto response = _mapper.EntityToResponseDto(referee);

    return new ReturnModel<RefereeResponseDto>()
    {
      Success = true,
      Message = "Hakem bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<RefereePreviewDto>>> GetByPersonalityTypeAsync(
    RefereePersonalityType personalityType,
    CancellationToken cancellationToken = default)
  {
    List<Referee> referees = await _refereeRepository.GetByPersonalityTypeAsync(
      personalityType,
      cancellationToken: cancellationToken);

    List<RefereePreviewDto> response = _mapper.EntityToPreviewDtoList(referees);

    return new ReturnModel<List<RefereePreviewDto>>()
    {
      Success = true,
      Message = "Karakter tipine göre hakemler başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<RefereePreviewDto>>> GetEasiestToBribeAsync(
    int count,
    CancellationToken cancellationToken = default)
  {
    List<Referee> referees = await _refereeRepository.GetEasiestToBribeAsync(
      count,
      cancellationToken: cancellationToken);

    List<RefereePreviewDto> response = _mapper.EntityToPreviewDtoList(referees);

    return new ReturnModel<List<RefereePreviewDto>>()
    {
      Success = true,
      Message = "Rüşvete en açık hakemler başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedRefereeResponseDto>> AddAsync(
    CreateRefereeRequest request,
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

    Referee referee = _mapper.CreateToEntity(request);

    await _refereeRepository.AddAsync(referee, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedRefereeResponseDto response = _mapper.EntityToCreatedResponseDto(referee);

    return new ReturnModel<CreatedRefereeResponseDto>()
    {
      Success = true,
      Message = "Hakem başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateRefereeRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Referee referee = await _businessRules.GetRefereeIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.NameMustBeUniqueAsync(request.Name, request.Id, cancellationToken);

    _mapper.UpdateEntityFromRequest(request, referee);

    _refereeRepository.Update(referee);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Hakem bilgileri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    int id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    Referee referee = await _businessRules.GetRefereeIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _refereeRepository.Delete(referee);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Hakem başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}
