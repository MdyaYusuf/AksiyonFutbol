using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.ClubLineups;

public class ClubLineupService(
  IClubLineupRepository _clubLineupRepository,
  IClubLineupSelectionRepository _clubLineupSelectionRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IDefaultClubLineupService _defaultClubLineupService,
  ClubLineupBusinessRules _businessRules,
  ClubLineupMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<UpsertClubLineupRequest> _upsertValidator) : IClubLineupService
{
  public async Task<ReturnModel<ClubLineupResponseDto>> GetForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(currentUserId, cancellationToken: cancellationToken);

    ClubLineup lineup = await GetOrThrowAsync(club.Id, cancellationToken);
    ClubLineupResponseDto response = _mapper.EntityToResponseDto(lineup);

    return new ReturnModel<ClubLineupResponseDto>()
    {
      Success = true,
      Message = "Kulüp dizilişi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubLineupResponseDto>> GetByClubIdAsync(
    Guid clubId,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubIfExistAsync(
      clubId,
      include: query => query.Include(c => c.President),
      cancellationToken: cancellationToken);

    _businessRules.ClubMustBelongToCurrentUserOrAdmin(club, currentUserId, userRole);

    ClubLineup lineup = await GetOrThrowAsync(clubId, cancellationToken);
    ClubLineupResponseDto response = _mapper.EntityToResponseDto(lineup);

    return new ReturnModel<ClubLineupResponseDto>()
    {
      Success = true,
      Message = "Kulüp dizilişi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubLineupResponseDto>> UpsertForCurrentUserAsync(
    UpsertClubLineupRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: query => query.Include(c => c.President),
      cancellationToken: cancellationToken);

    ClubLineup lineup = await UpsertInternalAsync(club.Id, request, cancellationToken);
    ClubLineupResponseDto response = _mapper.EntityToResponseDto(lineup);

    return new ReturnModel<ClubLineupResponseDto>()
    {
      Success = true,
      Message = "Kulüp dizilişi başarılı bir şekilde kaydedildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubLineupResponseDto>> UpsertByClubIdAsync(
    Guid clubId,
    UpsertClubLineupRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubIfExistAsync(
      clubId,
      include: query => query.Include(c => c.President),
      cancellationToken: cancellationToken);

    _businessRules.ClubMustBelongToCurrentUserOrAdmin(club, currentUserId, userRole);

    ClubLineup lineup = await UpsertInternalAsync(clubId, request, cancellationToken);
    ClubLineupResponseDto response = _mapper.EntityToResponseDto(lineup);

    return new ReturnModel<ClubLineupResponseDto>()
    {
      Success = true,
      Message = "Kulüp dizilişi başarılı bir şekilde kaydedildi.",
      Data = response,
      StatusCode = 200
    };
  }

  private async Task<ClubLineup> UpsertInternalAsync(
    Guid clubId,
    UpsertClubLineupRequest request,
    CancellationToken cancellationToken)
  {
    var validationResult = await _upsertValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new FluentValidation.ValidationException(validationResult.Errors);
    }

    List<Guid> allPlayerIds = request.StarterPlayerIds.Concat(request.BenchPlayerIds).ToList();
    await _businessRules.ValidatePlayersBelongToClubAsync(clubId, allPlayerIds, cancellationToken);

    List<PlayerInstance> clubPlayers = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId,
      cancellationToken: cancellationToken);

    Dictionary<Guid, PlayerInstance> playersById = clubPlayers.ToDictionary(p => p.Id);

    _businessRules.StartersMustIncludeGoalkeeper(request.StarterPlayerIds, playersById);
    _businessRules.StartersShouldNotBeInjured(request.StarterPlayerIds, playersById);

    ClubLineup? lineup = await _clubLineupRepository.GetAsync(
      l => l.ClubId == clubId,
      include: IncludeLineupRelations,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (lineup == null)
    {
      lineup = new ClubLineup
      {
        ClubId = clubId,
        Formation = request.Formation,
        Mentality = request.Mentality
      };

      AddSelections(lineup, request.StarterPlayerIds.Select(id => playersById[id]), isStarter: true);
      AddSelections(lineup, request.BenchPlayerIds.Select(id => playersById[id]), isStarter: false);

      await _clubLineupRepository.AddAsync(lineup, cancellationToken);
    }
    else
    {
      if (lineup.Selections.Count > 0)
      {
        _clubLineupSelectionRepository.DeleteRange(lineup.Selections.ToList());
        lineup.Selections.Clear();
      }

      lineup.Formation = request.Formation;
      lineup.Mentality = request.Mentality;

      AddSelections(lineup, request.StarterPlayerIds.Select(id => playersById[id]), isStarter: true);
      AddSelections(lineup, request.BenchPlayerIds.Select(id => playersById[id]), isStarter: false);

      _clubLineupRepository.Update(lineup);
    }

    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return await GetOrThrowAsync(clubId, cancellationToken);
  }

  private async Task<ClubLineup> GetOrThrowAsync(Guid clubId, CancellationToken cancellationToken)
  {
    ClubLineup? lineup = await _clubLineupRepository.GetAsync(
      l => l.ClubId == clubId,
      include: IncludeLineupRelations,
      cancellationToken: cancellationToken);

    if (lineup == null)
    {
      await _defaultClubLineupService.EnsureAsync(clubId, cancellationToken);
      await _unitOfWork.SaveChangesAsync(cancellationToken);

      lineup = await _clubLineupRepository.GetAsync(
        l => l.ClubId == clubId,
        include: IncludeLineupRelations,
        cancellationToken: cancellationToken);
    }

    if (lineup == null)
    {
      throw new Api.Core.Exceptions.NotFoundException("Bu kulüp için kayıtlı bir diziliş bulunamadı.");
    }

    return lineup;
  }

  private static void AddSelections(
    ClubLineup lineup,
    IEnumerable<PlayerInstance> players,
    bool isStarter)
  {
    int order = 0;

    foreach (PlayerInstance player in players)
    {
      lineup.Selections.Add(new ClubLineupSelection
      {
        IsStarter = isStarter,
        SortOrder = order++,
        PlayerInstanceId = player.Id
      });
    }
  }

  private static IQueryable<ClubLineup> IncludeLineupRelations(IQueryable<ClubLineup> query)
  {
    return query
      .Include(l => l.Club)
      .Include(l => l.Selections)
        .ThenInclude(s => s.PlayerInstance);
  }
}
