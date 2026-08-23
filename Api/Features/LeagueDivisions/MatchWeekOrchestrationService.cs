using Api.Core.Responses;
using Api.Core.Repositories;
using Api.Features.Matches;
using Api.Features.SeasonTransitions;

namespace Api.Features.LeagueDivisions;

public class MatchWeekOrchestrationService(
  LeagueDivisionBusinessRules _leagueBusinessRules,
  IMatchRepository _matchRepository,
  IMatchPlayService _matchPlayService,
  IMatchWeekProgressService _matchWeekProgressService,
  ICompetitiveSeasonEndService _competitiveSeasonEndService,
  IUnitOfWork _unitOfWork) : IMatchWeekOrchestrationService
{
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

    List<Match> weekMatches = await _matchRepository.GetAllAsync(
      filter: m =>
        m.DivisionId == divisionId &&
        m.Season == leagueDivision.CurrentSeason &&
        m.MatchWeek == processedMatchWeek,
      include: MatchPlayService.IncludeMatchRelations,
      enableTracking: true,
      orderBy: query => query.OrderBy(m => m.MatchDate).ThenBy(m => m.HomeClub.DisplayName),
      cancellationToken: cancellationToken);

    List<Match> unplayedMatches = weekMatches
      .Where(match => !match.IsPlayed)
      .OrderBy(match => match.MatchDate)
      .ToList();

    foreach (Match match in unplayedMatches)
    {
      await _matchPlayService.SimulateInPlaceAsync(match, cancellationToken);
    }

    await _unitOfWork.SaveChangesAsync(cancellationToken);

    bool weekAdvanced = await _matchWeekProgressService.TryAdvanceIfWeekCompleteAsync(
      divisionId,
      leagueDivision.CurrentSeason,
      processedMatchWeek,
      cancellationToken);

    if (unplayedMatches.Count > 0)
    {
      await _competitiveSeasonEndService.TryProcessAfterMatchAsync(
        unplayedMatches[^1],
        cancellationToken);
    }

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
}
