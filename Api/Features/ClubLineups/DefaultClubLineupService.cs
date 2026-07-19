using Api.Features.PlayerInstances;

namespace Api.Features.ClubLineups;

public class DefaultClubLineupService(
  IClubLineupRepository _clubLineupRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  ClubLineupBusinessRules _businessRules) : IDefaultClubLineupService
{
  public async Task EnsureAsync(Guid clubId, CancellationToken cancellationToken = default)
  {
    ClubLineup? existing = await _clubLineupRepository.GetAsync(
      l => l.ClubId == clubId,
      cancellationToken: cancellationToken);

    if (existing != null)
    {
      return;
    }

    await _businessRules.GetClubIfExistAsync(clubId, cancellationToken: cancellationToken);

    List<PlayerInstance> players = await _playerInstanceRepository.GetAllAsync(
      filter: pi => pi.ClubId == clubId,
      cancellationToken: cancellationToken);

    List<PlayerInstance> available = players.Where(p => !p.IsInjured).ToList();

    if (available.Count == 0)
    {
      available = players;
    }

    if (available.Count == 0)
    {
      return;
    }

    List<PlayerInstance> starters = LineupSelectionHelper.BuildStartingXi(
      available,
      TeamFormation.FourThreeThree,
      preferredStarterIds: null,
      starterCount: _businessRules.StarterCount);

    HashSet<Guid> starterIds = starters.Select(p => p.Id).ToHashSet();

    List<PlayerInstance> bench = LineupSelectionHelper.BuildBench(
      available,
      starterIds,
      preferredBenchIds: null,
      maxBenchSize: _businessRules.MaxBenchSize);

    ClubLineup lineup = new()
    {
      ClubId = clubId,
      Formation = TeamFormation.FourThreeThree,
      Mentality = TeamMentality.Balanced
    };

    AddSelections(lineup, starters, isStarter: true);
    AddSelections(lineup, bench, isStarter: false);

    await _clubLineupRepository.AddAsync(lineup, cancellationToken);
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
}
