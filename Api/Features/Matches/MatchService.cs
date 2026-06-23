using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Matches;

public class MatchService(
  IMatchRepository _matchRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  MatchMapper _mapper,
  MatchBusinessRules _businessRules,
  IMatchSimulationService _matchSimulationService,
  IUnitOfWork _unitOfWork,
  IValidator<CreateMatchRequest> _createValidator,
  IValidator<UpdateMatchScheduleRequest> _updateScheduleValidator) : IMatchService
{
  private static readonly TimeZoneInfo _gameTimeZone = GetGameTimeZone();

  public async Task<ReturnModel<List<MatchResponseDto>>> GetAllAsync(CancellationToken cancellationToken = default)
  {
    List<Match> matches = await _matchRepository.GetAllAsync(
      include: IncludeMatchRelations,
      orderBy: query => query.OrderByDescending(m => m.MatchDate),
      cancellationToken: cancellationToken);

    List<MatchResponseDto> response = _mapper.EntityToResponseDtoList(matches);

    return new ReturnModel<List<MatchResponseDto>>()
    {
      Success = true,
      Message = "Maç listesi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<MatchResponseDto>> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default)
  {
    Match match = await _businessRules.GetMatchIfExistAsync(
      id,
      include: IncludeMatchRelations,
      cancellationToken: cancellationToken);

    MatchResponseDto response = _mapper.EntityToResponseDto(match);

    return new ReturnModel<MatchResponseDto>()
    {
      Success = true,
      Message = "Maç bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<MatchPreviewDto>>> GetByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.GetClubIfExistAsync(clubId, cancellationToken);

    List<Match> matches = await _matchRepository.GetByClubIdAsync(
      clubId,
      include: IncludeMatchRelations,
      cancellationToken: cancellationToken);

    List<MatchPreviewDto> response = _mapper.EntityToPreviewDtoList(matches);

    return new ReturnModel<List<MatchPreviewDto>>()
    {
      Success = true,
      Message = "Kulübün maçları başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<MatchPreviewDto>>> GetByDivisionAndMatchWeekAsync(
    int divisionId,
    int matchWeek,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.DivisionMustExistAsync(divisionId, cancellationToken);

    List<Match> matches = await _matchRepository.GetByDivisionAndMatchWeekAsync(
      divisionId,
      matchWeek,
      include: IncludeMatchRelations,
      cancellationToken: cancellationToken);

    List<MatchPreviewDto> response = _mapper.EntityToPreviewDtoList(matches);

    return new ReturnModel<List<MatchPreviewDto>>()
    {
      Success = true,
      Message = "Lig haftası maçları başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<MatchPreviewDto>>> GetScheduledUnplayedAsync(
    int count,
    CancellationToken cancellationToken = default)
  {
    int safeCount = Math.Clamp(count, 1, 100);

    List<Match> matches = await _matchRepository.GetScheduledUnplayedAsync(
      DateTime.UtcNow,
      safeCount,
      include: IncludeMatchRelations,
      cancellationToken: cancellationToken);

    List<MatchPreviewDto> response = _mapper.EntityToPreviewDtoList(matches);

    return new ReturnModel<List<MatchPreviewDto>>()
    {
      Success = true,
      Message = "Oynanmamış planlı maçlar başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedMatchResponseDto>> AddAsync(
    CreateMatchRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    _businessRules.ClubsMustBeDifferent(request.HomeClubId, request.AwayClubId);
    await _businessRules.DivisionMustExistAsync(request.DivisionId, cancellationToken);
    await _businessRules.RefereeMustExistWhenProvidedAsync(request.RefereeId, cancellationToken);

    Club homeClub = await _businessRules.GetClubIfExistAsync(request.HomeClubId, cancellationToken);
    Club awayClub = await _businessRules.GetClubIfExistAsync(request.AwayClubId, cancellationToken);

    _businessRules.ClubsMustBelongToDivision(homeClub, awayClub, request.DivisionId);
    await _businessRules.FixtureMustBeUniqueAsync(
      request.DivisionId,
      request.MatchWeek,
      request.HomeClubId,
      request.AwayClubId,
      cancellationToken: cancellationToken);

    Match match = _mapper.CreateToEntity(request);
    match.MatchDate = ConvertGameLocalTimeToUtc(request.MatchDate);

    await _matchRepository.AddAsync(match, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedMatchResponseDto response = _mapper.EntityToCreatedResponseDto(match);

    return new ReturnModel<CreatedMatchResponseDto>()
    {
      Success = true,
      Message = "Maç başarılı bir şekilde oluşturuldu.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<MatchResponseDto>> UpdateScheduleAsync(
    UpdateMatchScheduleRequest request,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    var validationResult = await _updateScheduleValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Match match = await _businessRules.GetMatchIfExistAsync(
      request.Id,
      include: IncludeMatchRelations,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.MatchMustNotBePlayed(match);
    _businessRules.ClubsMustBeDifferent(request.HomeClubId, request.AwayClubId);
    await _businessRules.DivisionMustExistAsync(request.DivisionId, cancellationToken);
    await _businessRules.RefereeMustExistWhenProvidedAsync(request.RefereeId, cancellationToken);

    Club homeClub = await _businessRules.GetClubIfExistAsync(request.HomeClubId, cancellationToken);
    Club awayClub = await _businessRules.GetClubIfExistAsync(request.AwayClubId, cancellationToken);

    _businessRules.ClubsMustBelongToDivision(homeClub, awayClub, request.DivisionId);
    await _businessRules.FixtureMustBeUniqueAsync(
      request.DivisionId,
      request.MatchWeek,
      request.HomeClubId,
      request.AwayClubId,
      request.Id,
      cancellationToken);

    _mapper.UpdateEntityFromScheduleRequest(request, match);
    match.MatchDate = ConvertGameLocalTimeToUtc(request.MatchDate);

    _matchRepository.Update(match);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    Match refreshedMatch = await _businessRules.GetMatchIfExistAsync(
      match.Id,
      include: IncludeMatchRelations,
      cancellationToken: cancellationToken);

    MatchResponseDto response = _mapper.EntityToResponseDto(refreshedMatch);

    return new ReturnModel<MatchResponseDto>()
    {
      Success = true,
      Message = "Maç programı başarılı bir şekilde güncellendi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<MatchResponseDto>> SimulateAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    Match match = await _businessRules.GetMatchIfExistAsync(
      id,
      include: IncludeMatchRelations,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.MatchMustNotBePlayed(match);
    _businessRules.MatchMustHaveReferee(match);

    List<PlayerInstance> homePlayers = await _playerInstanceRepository.GetAvailableByClubIdAsync(
      match.HomeClubId,
      cancellationToken: cancellationToken);

    List<PlayerInstance> awayPlayers = await _playerInstanceRepository.GetAvailableByClubIdAsync(
      match.AwayClubId,
      cancellationToken: cancellationToken);

    _businessRules.ClubsMustHaveAvailablePlayers(homePlayers.Count, awayPlayers.Count);

    SimulatedMatchResultDto result = _matchSimulationService.Simulate(
      match,
      homePlayers,
      awayPlayers,
      match.Referee!);

    match.HomeScore = result.HomeScore;
    match.AwayScore = result.AwayScore;
    match.MatchLogJson = result.MatchLogJson;
    match.IsPlayed = true;

    _matchRepository.Update(match);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    MatchResponseDto response = _mapper.EntityToResponseDto(match);

    return new ReturnModel<MatchResponseDto>()
    {
      Success = true,
      Message = "Maç başarılı bir şekilde simüle edildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<string>> DeleteAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.AdminRoleRequired(userRole);

    Match match = await _businessRules.GetMatchIfExistAsync(
      id,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.MatchMustNotBePlayed(match);

    _matchRepository.Delete(match);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<string>()
    {
      Success = true,
      Message = "Maç başarılı bir şekilde silindi.",
      Data = "Maç silindi.",
      StatusCode = 200
    };
  }

  private static IQueryable<Match> IncludeMatchRelations(IQueryable<Match> query)
  {
    return query
      .Include(m => m.Division)
      .Include(m => m.HomeClub)
      .Include(m => m.AwayClub)
      .Include(m => m.Referee);
  }

  private static DateTime ConvertGameLocalTimeToUtc(DateTime matchDate)
  {
    if (matchDate.Kind == DateTimeKind.Utc)
    {
      return matchDate;
    }

    DateTime gameLocalDate = DateTime.SpecifyKind(matchDate, DateTimeKind.Unspecified);
    return TimeZoneInfo.ConvertTimeToUtc(gameLocalDate, _gameTimeZone);
  }

  private static TimeZoneInfo GetGameTimeZone()
  {
    string timeZoneId = OperatingSystem.IsWindows()
      ? "Turkey Standard Time"
      : "Europe/Istanbul";

    return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
  }
}
