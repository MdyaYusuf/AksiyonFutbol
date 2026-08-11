using Api.Core.Repositories;
using Api.Features.Actions;
using Api.Features.ClubLineups;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Matches;

public class MatchPlayService(
  IMatchRepository _matchRepository,
  IMatchDaySquadResolver _matchDaySquadResolver,
  MatchBusinessRules _businessRules,
  IMatchSimulationService _matchSimulationService,
  IMatchInfluenceProvider _matchInfluenceProvider,
  IPromiseWinBonusSettler _promiseWinBonusSettler,
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

    CaptureSettlementSnapshots(match);

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

    await _promiseWinBonusSettler.SettleAsync(
      match,
      result.HomeScore,
      result.AwayScore,
      cancellationToken);

    _matchRepository.Update(match);
  }

  private static void CaptureSettlementSnapshots(Match match)
  {
    if (match.HomeClub != null)
    {
      match.HomeCashBefore = match.HomeClub.Cash;
      match.HomeMoraleBefore = match.HomeClub.Morale;
      match.HomeSuspicionBefore = match.HomeClub.Suspicion;
    }

    if (match.AwayClub != null)
    {
      match.AwayCashBefore = match.AwayClub.Cash;
      match.AwayMoraleBefore = match.AwayClub.Morale;
      match.AwaySuspicionBefore = match.AwayClub.Suspicion;
    }
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
