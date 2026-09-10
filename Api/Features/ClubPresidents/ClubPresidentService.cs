using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Objectives;
using Api.Features.Users;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.ClubPresidents;

public class ClubPresidentService(
  IClubPresidentRepository _clubPresidentRepository,
  ClubPresidentMapper _mapper,
  ClubPresidentBusinessRules _businessRules,
  ObjectivesBusinessRules _objectivesBusinessRules,
  UserBusinessRules _userBusinessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateClubPresidentRequest> _createValidator,
  IValidator<UpdateClubPresidentRequest> _updateValidator,
  IValidator<UpdateClubPresidentReputationRequest> _updateReputationValidator) : IClubPresidentService
{
  public async Task<ReturnModel<PagedResponse<ClubPresidentResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<ClubPresident, bool>>? filter = null,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    Func<IQueryable<ClubPresident>, IOrderedQueryable<ClubPresident>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var (clubPresidents, totalCount) = await _clubPresidentRepository.GetPagedListAsync(
      currentPage,
      pageSize,
      filter,
      include: include ?? (query => query.Include(cp => cp.User)),
      orderBy,
      enableTracking,
      withDeleted,
      cancellationToken);

    List<ClubPresidentResponseDto> responseDtos = _mapper.EntityToResponseDtoList(clubPresidents);
    var pagedResponse = new PagedResponse<ClubPresidentResponseDto>(responseDtos, totalCount, currentPage, pageSize);

    return new ReturnModel<PagedResponse<ClubPresidentResponseDto>>()
    {
      Success = true,
      Message = "Kulüp başkanı listesi başarılı bir şekilde getirildi.",
      Data = pagedResponse,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubPresidentResponseDto>> GetAsync(
    Expression<Func<ClubPresident, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    ClubPresident? clubPresident = await _clubPresidentRepository.GetAsync(
      predicate,
      include: include ?? (query => query.Include(cp => cp.User)),
      enableTracking,
      cancellationToken);

    if (clubPresident == null)
    {
      return new ReturnModel<ClubPresidentResponseDto>()
      {
        Success = true,
        Message = "Eşleşen kulüp başkanı bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    _businessRules.PresidentMustBelongToCurrentUserOrAdmin(clubPresident, currentUserId, userRole);

    ClubPresidentResponseDto response = _mapper.EntityToResponseDto(clubPresident);

    return new ReturnModel<ClubPresidentResponseDto>()
    {
      Success = true,
      Message = "Kulüp başkanı bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubPresidentResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    ClubPresident clubPresident = await _businessRules.GetClubPresidentIfExistAsync(
      id,
      include: include ?? (query => query.Include(cp => cp.User)),
      enableTracking,
      cancellationToken);

    _businessRules.PresidentMustBelongToCurrentUserOrAdmin(clubPresident, currentUserId, userRole);

    ClubPresidentResponseDto response = _mapper.EntityToResponseDto(clubPresident);

    return new ReturnModel<ClubPresidentResponseDto>()
    {
      Success = true,
      Message = "Kulüp başkanı bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubPresidentResponseDto>> GetByCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    ClubPresident clubPresident = await _businessRules.GetClubPresidentByUserIdIfExistAsync(
      currentUserId,
      include: query => query.Include(cp => cp.User),
      cancellationToken: cancellationToken);

    ClubPresidentResponseDto response = _mapper.EntityToResponseDto(clubPresident);

    return new ReturnModel<ClubPresidentResponseDto>()
    {
      Success = true,
      Message = "Kulüp başkanı profiliniz başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<bool>> CheckCurrentUserHasPresidentAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    bool hasPresident = await _clubPresidentRepository.UserHasPresidentAsync(currentUserId, cancellationToken);

    return new ReturnModel<bool>()
    {
      Success = true,
      Message = hasPresident ? "Kullanıcının kulüp başkanı profili bulunuyor." : "Kullanıcının kulüp başkanı profili bulunmuyor.",
      Data = hasPresident,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedClubPresidentResponseDto>> AddAsync(
    CreateClubPresidentRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _userBusinessRules.UserIdMustExist(currentUserId, cancellationToken);
    await _businessRules.UserMustNotHavePresidentAsync(currentUserId, cancellationToken);
    _businessRules.PresidentNameCannotBeRestrictedWord(request.Name);
    await _businessRules.PresidentNameMustBeUniqueAsync(request.Name, cancellationToken: cancellationToken);
    _businessRules.EnsureValidAttributeAllocation(
      request.Charisma,
      request.Authority,
      request.Integrity,
      request.Cunning,
      request.Connections);

    ClubPresident clubPresident = _mapper.CreateToEntity(request);
    clubPresident.UserId = currentUserId;
    clubPresident.ReputationPoints = 0;
    clubPresident.Title = ClubPresidentBusinessRules.DefaultTitle;

    await _clubPresidentRepository.AddAsync(clubPresident, cancellationToken);
    await _objectivesBusinessRules.UnlockTitleIfMissingAsync(
      clubPresident,
      ObjectivesBusinessRules.ToTitleKey(ClubPresidentBusinessRules.DefaultTitle),
      ClubPresidentBusinessRules.DefaultTitle,
      TitleUnlockSource.Starting,
      cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedClubPresidentResponseDto response = _mapper.EntityToCreatedResponseDto(clubPresident);

    return new ReturnModel<CreatedClubPresidentResponseDto>()
    {
      Success = true,
      Message = "Kulüp başkanı başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateClubPresidentRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    ClubPresident clubPresident = await _businessRules.GetClubPresidentIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.PresidentMustBelongToCurrentUserOrAdmin(clubPresident, currentUserId, userRole);
    _businessRules.PresidentNameCannotBeRestrictedWord(request.Name);
    await _businessRules.PresidentNameMustBeUniqueAsync(request.Name, request.Id, cancellationToken);

    _mapper.UpdateEntityFromRequest(request, clubPresident);

    _clubPresidentRepository.Update(clubPresident);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp başkanı bilgileri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateReputationAsync(
    UpdateClubPresidentReputationRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateReputationValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    ClubPresident clubPresident = await _businessRules.GetClubPresidentIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    clubPresident.ReputationPoints = request.ReputationPoints;

    _clubPresidentRepository.Update(clubPresident);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp başkanı itibarı başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    ClubPresident clubPresident = await _businessRules.GetClubPresidentIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.PresidentMustBelongToCurrentUserOrAdmin(clubPresident, currentUserId, userRole);

    _clubPresidentRepository.Delete(clubPresident);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp başkanı başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}
