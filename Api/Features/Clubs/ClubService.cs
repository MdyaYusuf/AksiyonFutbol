using System.Linq.Expressions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.ClubPresidents;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.Clubs;

public class ClubService(
  IClubRepository _clubRepository,
  ClubMapper _mapper,
  ClubBusinessRules _businessRules,
  IStarterSquadService _starterSquadService,
  IUnitOfWork _unitOfWork,
  IValidator<CreateClubRequest> _createValidator,
  IValidator<CreateBotClubRequest> _createBotValidator,
  IValidator<UpdateClubRequest> _updateValidator,
  IValidator<UpdateClubFinancesRequest> _updateFinancesValidator,
  IValidator<UpdateClubStatusRequest> _updateStatusValidator,
  IOptions<GameOptions> _gameOptions) : IClubService
{
  public async Task<ReturnModel<PagedResponse<ClubResponseDto>>> GetAllAsync(
    Expression<Func<Club, bool>>? filter = null,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    Func<IQueryable<Club>, IOrderedQueryable<Club>>? orderBy = null,
    int pageNumber = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var (clubs, totalCount) = await _clubRepository.GetPagedListAsync(
      pageNumber,
      pageSize,
      filter,
      include: include ?? IncludeClubRelations,
      orderBy ?? (query => query.OrderBy(c => c.Division.Tier).ThenBy(c => c.Division.GroupNumber).ThenBy(c => c.Name)),
      enableTracking,
      withDeleted,
      cancellationToken);

    List<ClubResponseDto> responseDtos = _mapper.EntityToResponseDtoList(clubs);
    var pagedResponse = new PagedResponse<ClubResponseDto>(responseDtos, totalCount, pageNumber, pageSize);

    return new ReturnModel<PagedResponse<ClubResponseDto>>()
    {
      Success = true,
      Message = "Kulüp listesi başarılı bir şekilde getirildi.",
      Data = pagedResponse,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubResponseDto>> GetAsync(
    Expression<Func<Club, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      predicate,
      include: include ?? IncludeClubRelations,
      enableTracking,
      cancellationToken);

    if (club == null)
    {
      return new ReturnModel<ClubResponseDto>()
      {
        Success = true,
        Message = "Eşleşen kulüp bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    ClubResponseDto response = _mapper.EntityToResponseDto(club);

    return new ReturnModel<ClubResponseDto>()
    {
      Success = true,
      Message = "Kulüp bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubIfExistAsync(
      id,
      include: include ?? IncludeClubRelations,
      enableTracking,
      cancellationToken);

    ClubResponseDto response = _mapper.EntityToResponseDto(club);

    return new ReturnModel<ClubResponseDto>()
    {
      Success = true,
      Message = "Kulüp bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubResponseDto>> GetByCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: IncludeClubRelations,
      cancellationToken: cancellationToken);

    ClubResponseDto response = _mapper.EntityToResponseDto(club);

    return new ReturnModel<ClubResponseDto>()
    {
      Success = true,
      Message = "Kulübünüz başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<ClubPreviewDto>>> GetByDivisionIdAsync(
    int divisionId,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.DivisionMustExistAsync(divisionId, cancellationToken);

    List<Club> clubs = await _clubRepository.GetByDivisionIdAsync(
      divisionId,
      include: IncludeClubRelations,
      cancellationToken: cancellationToken);

    List<ClubPreviewDto> response = _mapper.EntityToPreviewDtoList(clubs);

    return new ReturnModel<List<ClubPreviewDto>>()
    {
      Success = true,
      Message = "Lig kulüpleri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<bool>> CheckCurrentUserHasClubAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    ClubPresident president = await _businessRules.GetPresidentByUserIdIfExistAsync(currentUserId, cancellationToken);
    bool hasClub = await _clubRepository.PresidentHasClubAsync(president.Id, cancellationToken);

    return new ReturnModel<bool>()
    {
      Success = true,
      Message = hasClub ? "Kullanıcının kulübü bulunuyor." : "Kullanıcının kulübü bulunmuyor.",
      Data = hasClub,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedClubResponseDto>> AddAsync(
    CreateClubRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    ClubPresident president = await _businessRules.GetPresidentByUserIdIfExistAsync(currentUserId, cancellationToken);
    await _businessRules.DivisionMustExistAsync(request.DivisionId, cancellationToken);
    await _businessRules.DivisionMustHaveCapacityAsync(request.DivisionId, cancellationToken);
    await _businessRules.PresidentMustNotHaveClubAsync(president.Id, cancellationToken);
    _businessRules.ClubNameCannotBeRestrictedWord(request.Name);
    await _businessRules.ClubNameMustBeUniqueAsync(request.Name, cancellationToken: cancellationToken);

    Club club = _mapper.CreateToEntity(request);
    club.PresidentId = president.Id;
    club.IsBot = false;
    club.Cash = _gameOptions.Value.StartingCash;
    club.WageBudget = _gameOptions.Value.StartingWageBudget;
    club.Morale = _gameOptions.Value.StartingClubStatus;
    club.Chemistry = _gameOptions.Value.StartingClubStatus;
    club.Discipline = _gameOptions.Value.StartingClubStatus;

    await _clubRepository.AddAsync(club, cancellationToken);
    await _starterSquadService.AssignAsync(club, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedClubResponseDto response = _mapper.EntityToCreatedResponseDto(club);

    return new ReturnModel<CreatedClubResponseDto>()
    {
      Success = true,
      Message = "Kulüp başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<CreatedClubResponseDto>> AddBotAsync(
    CreateBotClubRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _createBotValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.DivisionMustExistAsync(request.DivisionId, cancellationToken);
    await _businessRules.DivisionMustHaveCapacityAsync(request.DivisionId, cancellationToken);
    _businessRules.ClubNameCannotBeRestrictedWord(request.Name);
    await _businessRules.ClubNameMustBeUniqueAsync(request.Name, cancellationToken: cancellationToken);

    Club club = _mapper.CreateBotToEntity(request);
    club.IsBot = true;
    club.PresidentId = null;

    await _clubRepository.AddAsync(club, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedClubResponseDto response = _mapper.EntityToCreatedResponseDto(club);

    return new ReturnModel<CreatedClubResponseDto>()
    {
      Success = true,
      Message = "Bot kulüp başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateClubRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Club club = await _businessRules.GetClubIfExistAsync(
      request.Id,
      include: query => query.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.ClubMustBelongToCurrentUserOrAdmin(club, currentUserId, userRole);
    _businessRules.ClubNameCannotBeRestrictedWord(request.Name);
    await _businessRules.ClubNameMustBeUniqueAsync(request.Name, request.Id, cancellationToken);

    _mapper.UpdateEntityFromRequest(request, club);

    _clubRepository.Update(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp bilgileri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateFinancesAsync(
    UpdateClubFinancesRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateFinancesValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Club club = await _businessRules.GetClubIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    club.Cash = request.Cash;
    club.WageBudget = request.WageBudget;

    _clubRepository.Update(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp finans bilgileri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateStatusAsync(
    UpdateClubStatusRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateStatusValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Club club = await _businessRules.GetClubIfExistAsync(
      request.Id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    club.Morale = request.Morale;
    club.Chemistry = request.Chemistry;
    club.Discipline = request.Discipline;

    _clubRepository.Update(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp durum bilgileri başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubIfExistAsync(
      id,
      include: query => query.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.ClubMustBelongToCurrentUserOrAdmin(club, currentUserId, userRole);

    _clubRepository.Delete(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kulüp başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }

  private static IQueryable<Club> IncludeClubRelations(IQueryable<Club> query)
  {
    return query.Include(c => c.President)
      .Include(c => c.Division);
  }
}
