using Api.Core.Repositories;
using Api.Features.ClubLineups;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Matches;

public class MatchPlayService(
  IMatchRepository _matchRepository,
  IMatchDaySquadResolver _matchDaySquadResolver,
  MatchBusinessRules _businessRules,
  IMatchSimulationService _matchSimulationService,
  IMatchInfluenceProvider _matchInfluenceProvider,
  IUnitOfWork _unitOfWork) : IMatchPlayService
{
  public async Task<Match> PlayAndPersistAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    Match match = await _businessRules.GetMatchIfExistAsync(
      matchId,
      include: IncludeMatchRelations,
      enableTracking: true,
      cancellationToken: cancellationToken);

    await SimulateInPlaceAsync(match, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return match;
  }

  public async Task SimulateInPlaceAsync(
    Match match,
    CancellationToken cancellationToken = default)
  {
    _businessRules.MatchMustNotBePlayed(match);
    _businessRules.MatchMustHaveReferee(match);

    MatchDaySquad homeSquad = await _matchDaySquadResolver.ResolveAsync(
      match.HomeClubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    MatchDaySquad awaySquad = await _matchDaySquadResolver.ResolveAsync(
      match.AwayClubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.ClubsMustHaveAvailablePlayers(
      homeSquad.StartingPlayers.Count,
      awaySquad.StartingPlayers.Count);

    MatchInfluence influence = await _matchInfluenceProvider.GetForMatchAsync(
      match.Id,
      cancellationToken);

    SimulatedMatchResultDto result = _matchSimulationService.Simulate(
      match,
      homeSquad,
      awaySquad,
      match.Referee!,
      influence);

    match.HomeScore = result.HomeScore;
    match.AwayScore = result.AwayScore;
    match.MatchLogJson = result.MatchLogJson;
    match.IsPlayed = true;

    _matchRepository.Update(match);
  }

  internal static IQueryable<Match> IncludeMatchRelations(IQueryable<Match> query)
  {
    return query
      .Include(m => m.Division)
      .Include(m => m.HomeClub)
      .Include(m => m.AwayClub)
      .Include(m => m.Referee);
  }
}
