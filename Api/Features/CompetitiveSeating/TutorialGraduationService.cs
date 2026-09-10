using Api.Core.Options;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.SeasonTransitions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.CompetitiveSeating;

public class TutorialGraduationService(
  IClubRepository _clubRepository,
  IMatchRepository _matchRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IPresidentSeasonIdentitySettler _seasonIdentitySettler,
  IOptions<GameOptions> _gameOptions) : ITutorialGraduationService
{
  public async Task TryGraduateAfterMatchAsync(
    Match match,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? division = await _leagueDivisionRepository.GetByIdAsync(
      match.DivisionId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (division == null
        || !division.IsTutorial
        || division.LifecycleStatus != DivisionLifecycleStatus.Active)
    {
      return;
    }

    List<Match> divisionMatches = await _matchRepository.GetAllAsync(
      filter: m => m.DivisionId == division.Id && m.Season == division.CurrentSeason,
      enableTracking: false,
      cancellationToken: cancellationToken);

    bool allPlayed = divisionMatches.All(m => m.IsPlayed || m.Id == match.Id);

    if (!allPlayed)
    {
      return;
    }

    List<Club> clubs = await _clubRepository.GetAllAsync(
      filter: c => c.DivisionId == division.Id,
      include: query => query.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (clubs.Count == 0)
    {
      return;
    }

    foreach (Match divisionMatch in divisionMatches)
    {
      if (divisionMatch.Id == match.Id)
      {
        divisionMatch.IsPlayed = true;
        divisionMatch.HomeScore = match.HomeScore;
        divisionMatch.AwayScore = match.AwayScore;
      }
    }

    IReadOnlyList<StandingRowDto> standings = SeasonStandingsCalculator.BuildStandings(
      clubs,
      divisionMatches,
      division.Id);

    GameOptions options = _gameOptions.Value;
    Dictionary<Guid, StandingRowDto> byClubId = standings.ToDictionary(s => s.ClubId);

    foreach (Club club in clubs)
    {
      if (club.IsBot || club.LifecycleStatus != ClubLifecycleStatus.Tutorial)
      {
        continue;
      }

      if (!byClubId.TryGetValue(club.Id, out StandingRowDto? row))
      {
        continue;
      }

      LeagueTier tier = TutorialGraduationBusinessRules.ResolvePlacementTier(
        row.Points,
        options);
      club.PlacementTargetTier = tier;
      club.LifecycleStatus = ClubLifecycleStatus.AwaitingPlacement;

      if (club.President != null)
      {
        await _seasonIdentitySettler.ApplyTutorialGraduationPackageAsync(
          club,
          club.President,
          tier,
          cancellationToken);
      }

      _clubRepository.Update(club);
    }

    division.CurrentMatchWeek = options.TutorialMatchWeeks;
    division.LifecycleStatus = DivisionLifecycleStatus.Sealed;
    _leagueDivisionRepository.Update(division);
  }
}
