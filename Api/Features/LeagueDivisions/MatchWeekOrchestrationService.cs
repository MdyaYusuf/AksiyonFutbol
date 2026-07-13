using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Options;

namespace Api.Features.LeagueDivisions;

public class MatchWeekOrchestrationService(
  ILeagueDivisionRepository _leagueDivisionRepository,
  LeagueDivisionBusinessRules _leagueBusinessRules,
  IMatchRepository _matchRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IMatchSimulationService _matchSimulationService,
  IUnitOfWork _unitOfWork,
  IOptions<GameOptions> _gameOptions,
  HybridCache _cache) : IMatchWeekOrchestrationService
{
  private const string LeagueCacheTag = "league-divisions";

  public async Task<ReturnModel<ProcessMatchWeekResultDto>> ProcessCurrentWeekAsync(
    int divisionId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _leagueBusinessRules.AdminRoleRequired(userRole);

    LeagueDivision leagueDivision = await _leagueBusinessRules.GetLeagueDivisionIfExistAsync(
      divisionId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    int processedMatchWeek = leagueDivision.CurrentMatchWeek;

    List<Match> weekMatches = await _matchRepository.GetByDivisionAndMatchWeekAsync(
      divisionId,
      processedMatchWeek,
      include: IncludeMatchRelations,
      enableTracking: true,
      cancellationToken: cancellationToken);

    List<Match> unplayedMatches = weekMatches
      .Where(match => !match.IsPlayed)
      .OrderBy(match => match.MatchDate)
      .ToList();

    foreach (Match match in unplayedMatches)
    {
      await SimulateMatchAsync(match, cancellationToken);
    }

    bool weekAdvanced = false;

    if (leagueDivision.CurrentMatchWeek < _gameOptions.Value.MaximumMatchWeek)
    {
      leagueDivision.CurrentMatchWeek++;
      _leagueDivisionRepository.Update(leagueDivision);
      weekAdvanced = true;
    }

    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(LeagueCacheTag, cancellationToken);

    var result = new ProcessMatchWeekResultDto
    {
      DivisionId = leagueDivision.Id,
      ProcessedMatchWeek = processedMatchWeek,
      SimulatedMatchCount = unplayedMatches.Count,
      CurrentMatchWeek = leagueDivision.CurrentMatchWeek,
      WeekAdvanced = weekAdvanced
    };

    string message = weekAdvanced
      ? $"{unplayedMatches.Count} maç simüle edildi. Lig hafta {leagueDivision.CurrentMatchWeek} konumuna ilerletildi."
      : $"{unplayedMatches.Count} maç simüle edildi. Lig sezonunun son maç haftasında kaldı.";

    return new ReturnModel<ProcessMatchWeekResultDto>
    {
      Success = true,
      Message = message,
      Data = result,
      StatusCode = 200
    };
  }

  private async Task SimulateMatchAsync(Match match, CancellationToken cancellationToken)
  {
    if (!match.RefereeId.HasValue || match.Referee == null)
    {
      throw new BusinessException(
        $"{match.HomeClub.Name} - {match.AwayClub.Name} maçı için hakem atanmalıdır.");
    }

    List<PlayerInstance> homePlayers = await _playerInstanceRepository.GetAvailableByClubIdAsync(
      match.HomeClubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    List<PlayerInstance> awayPlayers = await _playerInstanceRepository.GetAvailableByClubIdAsync(
      match.AwayClubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (homePlayers.Count == 0 || awayPlayers.Count == 0)
    {
      throw new BusinessException(
        $"{match.HomeClub.Name} - {match.AwayClub.Name} maçı için her iki kulübün de en az bir uygun oyuncusu bulunmalıdır.");
    }

    SimulatedMatchResultDto simulation = _matchSimulationService.Simulate(
      match,
      homePlayers,
      awayPlayers,
      match.Referee);

    match.HomeScore = simulation.HomeScore;
    match.AwayScore = simulation.AwayScore;
    match.MatchLogJson = simulation.MatchLogJson;
    match.IsPlayed = true;

    _matchRepository.Update(match);
  }

  private static IQueryable<Match> IncludeMatchRelations(IQueryable<Match> query)
  {
    return query
      .Include(m => m.Division)
      .Include(m => m.HomeClub)
      .Include(m => m.AwayClub)
      .Include(m => m.Referee);
  }
}
