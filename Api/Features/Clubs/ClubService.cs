using System.Linq.Expressions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.ClubLineups;
using Api.Features.ClubPresidents;
using Api.Features.Matches;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.Clubs;

public class ClubService(
  IClubRepository _clubRepository,
  ClubMapper _mapper,
  ClubBusinessRules _businessRules,
  IStarterSquadService _starterSquadService,
  IDefaultClubLineupService _defaultClubLineupService,
  IUnitOfWork _unitOfWork,
  IValidator<CreateClubRequest> _createValidator,
  IValidator<CreateBotClubRequest> _createBotValidator,
  IValidator<UpdateClubRequest> _updateValidator,
  IValidator<UpdateClubFinancesRequest> _updateFinancesValidator,
  IValidator<UpdateClubStatusRequest> _updateStatusValidator,
  IOptions<GameOptions> _gameOptions,
  IMatchSettlementGate _settlementGate) : IClubService
{
  public Task<ReturnModel<PagedResponse<ClubResponseDto>>> GetAllAsync(
    ClubListQuery query,
    CancellationToken cancellationToken = default)
  {
    return GetAllAsync(
      filter: BuildListFilter(query),
      currentPage: query.CurrentPage,
      pageSize: query.PageSize,
      cancellationToken: cancellationToken);
  }

  public async Task<ReturnModel<PagedResponse<ClubResponseDto>>> GetAllAsync(
    Expression<Func<Club, bool>>? filter = null,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    Func<IQueryable<Club>, IOrderedQueryable<Club>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var (clubs, totalCount) = await _clubRepository.GetPagedListAsync(
      currentPage,
      pageSize,
      filter,
      include: include ?? IncludeClubRelations,
      orderBy ?? (query => query
        .OrderBy(c => c.DivisionId == null ? 1 : 0)
        .ThenBy(c => c.Division!.Tier)
        .ThenBy(c => c.Division!.GroupNumber)
        .ThenBy(c => c.Name)),
      enableTracking,
      withDeleted,
      cancellationToken);

    List<ClubResponseDto> responseDtos = await OverlayClubResponsesAsync(
      clubs,
      _mapper.EntityToResponseDtoList(clubs),
      cancellationToken);
    var pagedResponse = new PagedResponse<ClubResponseDto>(responseDtos, totalCount, currentPage, pageSize);

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

    ClubResponseDto response = await OverlayClubResponseAsync(club, cancellationToken);

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

    ClubResponseDto response = await OverlayClubResponseAsync(club, cancellationToken);

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

    ClubResponseDto response = await OverlayClubResponseAsync(club, cancellationToken);

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

    List<Club> clubs = await _clubRepository.GetAllAsync(
      filter: c => c.DivisionId == divisionId,
      include: IncludeClubRelations,
      orderBy: query => query.OrderBy(c => c.Name),
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

  public Task<ReturnModel<ClubCreationDefaultsDto>> GetCreationDefaultsAsync(
    CancellationToken cancellationToken = default)
  {
    ClubCreationDefaultsDto defaults = new()
    {
      StartingCash = _gameOptions.Value.DraftStartingCash,
      StartingWageBudget = _gameOptions.Value.DraftWageBudget,
      StartingClubStatus = _gameOptions.Value.StartingClubStatus,
    };

    return Task.FromResult(new ReturnModel<ClubCreationDefaultsDto>()
    {
      Success = true,
      Message = "Kulüp oluşturma varsayılanları başarılı bir şekilde getirildi.",
      Data = defaults,
      StatusCode = 200
    });
  }

  public async Task<ReturnModel<List<ClubOptionDto>>> GetOptionsAsync(
    CancellationToken cancellationToken = default)
  {
    List<Club> clubs = await _clubRepository.GetAllAsync(
      include: q => q.Include(c => c.President),
      orderBy: query => query.OrderBy(c => c.DisplayName).ThenBy(c => c.Name),
      cancellationToken: cancellationToken);

    List<ClubOptionDto> options = clubs
      .Select(c => new ClubOptionDto
      {
        Id = c.Id,
        DisplayName = c.DisplayName,
        IsBot = c.IsBot,
        DivisionId = c.DivisionId,
        PresidentName = c.President?.Name,
        CreatedDate = c.CreatedDate,
      })
      .ToList();

    return new ReturnModel<List<ClubOptionDto>>()
    {
      Success = true,
      Message = "Kulüp seçenekleri başarılı bir şekilde getirildi.",
      Data = options,
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
    await _businessRules.PresidentMustNotHaveClubAsync(president.Id, cancellationToken);
    _businessRules.ClubNameCannotBeRestrictedWord(request.Name);
    await _businessRules.ClubNameCannotMatchBotTemplateAsync(request.Name, cancellationToken);
    await _businessRules.ClubNameMustBeUniqueAsync(request.Name, cancellationToken: cancellationToken);

    Club club = _mapper.CreateToEntity(request);
    club.DisplayName = club.Name;
    club.PresidentId = president.Id;
    club.IsBot = false;
    club.DivisionId = null;
    club.TutorialDivisionId = null;
    club.LifecycleStatus = ClubLifecycleStatus.Drafting;
    club.PlacementTargetTier = null;
    club.Cash = _gameOptions.Value.DraftStartingCash;
    club.WageBudget = _gameOptions.Value.DraftWageBudget;
    club.Morale = _gameOptions.Value.StartingClubStatus;
    club.Chemistry = _gameOptions.Value.StartingClubStatus;
    club.Discipline = _gameOptions.Value.StartingClubStatus;
    club.Suspicion = _gameOptions.Value.StartingSuspicion;

    await _clubRepository.AddAsync(club, cancellationToken);
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

    (string instanceName, string displayName) = BotClubInstanceNaming.FromTemplate(request.Name);
    await _businessRules.ClubNameMustBeUniqueAsync(instanceName, cancellationToken: cancellationToken);
    await _businessRules.ClubDisplayNameMustBeUniqueInDivisionAsync(
      displayName,
      request.DivisionId,
      cancellationToken: cancellationToken);

    Club club = _mapper.CreateBotToEntity(request);
    club.Name = instanceName;
    club.DisplayName = displayName;
    club.IsBot = true;
    club.PresidentId = null;
    club.LifecycleStatus = ClubLifecycleStatus.Competitive;
    club.PlacementTargetTier = null;
    club.TutorialDivisionId = null;

    await _clubRepository.AddAsync(club, cancellationToken);
    await _starterSquadService.AssignAsync(club, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _defaultClubLineupService.EnsureAsync(club.Id, cancellationToken);
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

    if (club.IsBot)
    {
      if (club.DivisionId.HasValue)
      {
        await _businessRules.ClubDisplayNameMustBeUniqueInDivisionAsync(
          request.Name,
          club.DivisionId.Value,
          club.Id,
          cancellationToken);
      }

      club.DisplayName = request.Name.Trim();
    }
    else
    {
      await _businessRules.ClubNameCannotMatchBotTemplateAsync(request.Name, cancellationToken);
      await _businessRules.ClubNameMustBeUniqueAsync(request.Name, request.Id, cancellationToken);

      if (club.DivisionId.HasValue)
      {
        await _businessRules.ClubDisplayNameMustBeUniqueInDivisionAsync(
          request.Name,
          club.DivisionId.Value,
          club.Id,
          cancellationToken);
      }

      _mapper.UpdateEntityFromRequest(request, club);
      club.DisplayName = club.Name;
    }

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

  private async Task<ClubResponseDto> OverlayClubResponseAsync(
    Club club,
    CancellationToken cancellationToken)
  {
    ClubPublicView view = await _settlementGate.GetPublicViewAsync(club, cancellationToken);
    return ApplyPublicView(_mapper.EntityToResponseDto(club), view);
  }

  private async Task<List<ClubResponseDto>> OverlayClubResponsesAsync(
    IReadOnlyList<Club> clubs,
    List<ClubResponseDto> dtos,
    CancellationToken cancellationToken)
  {
    IReadOnlyDictionary<Guid, ClubPublicView> views =
      await _settlementGate.GetPublicViewsAsync(clubs, cancellationToken);

    for (int i = 0; i < dtos.Count; i++)
    {
      if (!views.TryGetValue(dtos[i].Id, out ClubPublicView? view))
      {
        continue;
      }

      dtos[i] = ApplyPublicView(dtos[i], view);
    }

    return dtos;
  }

  private static Expression<Func<Club, bool>>? BuildListFilter(ClubListQuery query)
  {
    string? trimmedSearch = query.Search?.Trim();
    bool hasSearch = !string.IsNullOrWhiteSpace(trimmedSearch);
    bool hasDivisionId = query.DivisionId.HasValue;
    bool hasIsBot = query.IsBot.HasValue;

    if (!hasSearch && !hasDivisionId && !hasIsBot)
    {
      return null;
    }

    string term = trimmedSearch ?? string.Empty;
    int divisionId = query.DivisionId ?? 0;
    bool isBot = query.IsBot ?? false;

    return c =>
      (!hasDivisionId || c.DivisionId == divisionId)
      && (!hasIsBot || c.IsBot == isBot)
      && (!hasSearch
        || c.Name.Contains(term)
        || c.DisplayName.Contains(term)
        || (c.Division != null && c.Division.Name.Contains(term))
        || (c.President != null && c.President.Name.Contains(term)));
  }

  private static ClubResponseDto ApplyPublicView(ClubResponseDto dto, ClubPublicView view)
  {
    return dto with
    {
      Cash = view.Cash,
      Morale = view.Morale,
      Suspicion = view.Suspicion,
      CashSpendLocked = view.CashSpendLocked
    };
  }

  private static IQueryable<Club> IncludeClubRelations(IQueryable<Club> query)
  {
    return query.Include(c => c.President)
      .Include(c => c.Division);
  }
}
