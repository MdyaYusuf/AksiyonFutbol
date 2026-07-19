using Api.Features.BasePlayers;
using Api.Features.PlayerInstances;

namespace Api.Features.ClubLineups;

public static class LineupSelectionHelper
{
  public static List<PlayerInstance> BuildStartingXi(
    IReadOnlyList<PlayerInstance> availablePlayers,
    TeamFormation formation,
    IReadOnlyList<Guid>? preferredStarterIds,
    int starterCount)
  {
    List<PlayerInstance> selected = [];
    HashSet<Guid> selectedIds = [];

    if (preferredStarterIds != null)
    {
      Dictionary<Guid, PlayerInstance> availableById = availablePlayers.ToDictionary(p => p.Id);

      foreach (Guid playerId in preferredStarterIds)
      {
        if (selected.Count >= starterCount)
        {
          break;
        }

        if (availableById.TryGetValue(playerId, out PlayerInstance? player) && selectedIds.Add(player.Id))
        {
          selected.Add(player);
        }
      }
    }

    if (selected.Count >= starterCount)
    {
      return selected;
    }

    List<PlayerInstance> remaining = availablePlayers
      .Where(p => !selectedIds.Contains(p.Id))
      .ToList();

    FillByFormation(selected, selectedIds, remaining, formation, starterCount);

    if (selected.Count < starterCount)
    {
      foreach (PlayerInstance player in remaining
        .Where(p => !selectedIds.Contains(p.Id))
        .OrderByDescending(PlayerInstanceRatingCalculator.Calculate)
        .ThenBy(p => p.LastName))
      {
        if (selected.Count >= starterCount)
        {
          break;
        }

        selected.Add(player);
        selectedIds.Add(player.Id);
      }
    }

    return selected;
  }

  public static List<PlayerInstance> BuildBench(
    IReadOnlyList<PlayerInstance> availablePlayers,
    IReadOnlyCollection<Guid> starterIds,
    IReadOnlyList<Guid>? preferredBenchIds,
    int maxBenchSize)
  {
    List<PlayerInstance> selected = [];
    HashSet<Guid> selectedIds = [];

    if (preferredBenchIds != null)
    {
      Dictionary<Guid, PlayerInstance> availableById = availablePlayers
        .Where(p => !starterIds.Contains(p.Id))
        .ToDictionary(p => p.Id);

      foreach (Guid playerId in preferredBenchIds)
      {
        if (selected.Count >= maxBenchSize)
        {
          break;
        }

        if (availableById.TryGetValue(playerId, out PlayerInstance? player) && selectedIds.Add(player.Id))
        {
          selected.Add(player);
        }
      }
    }

    if (selected.Count >= maxBenchSize)
    {
      return selected;
    }

    foreach (PlayerInstance player in availablePlayers
      .Where(p => !starterIds.Contains(p.Id) && !selectedIds.Contains(p.Id))
      .OrderByDescending(PlayerInstanceRatingCalculator.Calculate)
      .ThenBy(p => p.LastName))
    {
      if (selected.Count >= maxBenchSize)
      {
        break;
      }

      selected.Add(player);
      selectedIds.Add(player.Id);
    }

    return selected;
  }

  private static void FillByFormation(
    List<PlayerInstance> selected,
    HashSet<Guid> selectedIds,
    List<PlayerInstance> remaining,
    TeamFormation formation,
    int starterCount)
  {
    FormationShape shape = FormationShapes.Get(formation);

    PickForPosition(selected, selectedIds, remaining, PlayerPosition.Goalkeeper, shape.Goalkeepers, starterCount);
    PickForPosition(selected, selectedIds, remaining, PlayerPosition.Defender, shape.Defenders, starterCount);
    PickForPosition(selected, selectedIds, remaining, PlayerPosition.Midfielder, shape.Midfielders, starterCount);
    PickForPosition(selected, selectedIds, remaining, PlayerPosition.Forward, shape.Forwards, starterCount);
  }

  private static void PickForPosition(
    List<PlayerInstance> selected,
    HashSet<Guid> selectedIds,
    List<PlayerInstance> remaining,
    PlayerPosition position,
    int needed,
    int starterCount)
  {
    if (needed <= 0 || selected.Count >= starterCount)
    {
      return;
    }

    int alreadySelected = selected.Count(p => p.Position == position);
    int toPick = Math.Min(needed - alreadySelected, starterCount - selected.Count);

    if (toPick <= 0)
    {
      return;
    }

    List<PlayerInstance> picks = remaining
      .Where(p => !selectedIds.Contains(p.Id) && p.Position == position)
      .OrderByDescending(PlayerInstanceRatingCalculator.Calculate)
      .ThenBy(p => p.LastName)
      .Take(toPick)
      .ToList();

    foreach (PlayerInstance player in picks)
    {
      selected.Add(player);
      selectedIds.Add(player.Id);
    }
  }
}
