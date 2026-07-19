using Api.Features.PlayerInstances;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.ClubLineups;

public class MatchDaySquadResolver(
  IClubLineupRepository _clubLineupRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  ClubLineupBusinessRules _businessRules) : IMatchDaySquadResolver
{
  public async Task<MatchDaySquad> ResolveAsync(
    Guid clubId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    List<PlayerInstance> availablePlayers = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId && !pi.IsInjured,
      enableTracking: enableTracking,
      orderBy: query => query
        .OrderBy(pi => pi.Position)
        .ThenByDescending(pi => pi.AttackPower + pi.DefenseStrength + pi.MidfieldControl),
      cancellationToken: cancellationToken);

    ClubLineup? lineup = await _clubLineupRepository.GetAsync(
      l => l.ClubId == clubId,
      include: query => query.Include(l => l.Selections),
      cancellationToken: cancellationToken);

    TeamFormation formation = lineup?.Formation ?? TeamFormation.FourThreeThree;
    TeamMentality mentality = lineup?.Mentality ?? TeamMentality.Balanced;

    List<Guid>? preferredStarterIds = lineup?
      .Selections
      .Where(s => s.IsStarter)
      .OrderBy(s => s.SortOrder)
      .Select(s => s.PlayerInstanceId)
      .ToList();

    List<PlayerInstance> starters = LineupSelectionHelper.BuildStartingXi(
      availablePlayers,
      formation,
      preferredStarterIds,
      starterCount: _businessRules.StarterCount);

    if (starters.Count == 0 && availablePlayers.Count > 0)
    {
      starters = availablePlayers
        .OrderByDescending(PlayerInstanceRatingCalculator.Calculate)
        .Take(_businessRules.StarterCount)
        .ToList();
    }

    return new MatchDaySquad
    {
      StartingPlayers = starters,
      Formation = formation,
      Mentality = mentality,
      UsedSavedLineup = preferredStarterIds != null && preferredStarterIds.Count > 0
    };
  }
}
