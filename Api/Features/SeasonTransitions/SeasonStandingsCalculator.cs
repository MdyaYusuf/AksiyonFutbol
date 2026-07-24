using Api.Features.Clubs;
using Api.Features.Matches;

namespace Api.Features.SeasonTransitions;

public static class SeasonStandingsCalculator
{
  private sealed class ClubStats
  {
    public required Guid ClubId { get; init; }
    public required string ClubName { get; init; }
    public int Played { get; set; }
    public int Won { get; set; }
    public int Drawn { get; set; }
    public int Lost { get; set; }
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }

    public int Points => (Won * 3) + Drawn;
    public int GoalDifference => GoalsFor - GoalsAgainst;
  }

  public static IReadOnlyList<StandingRowDto> BuildStandings(
    IReadOnlyList<Club> clubs,
    IReadOnlyList<Match> matches,
    int divisionId)
  {
    Dictionary<Guid, ClubStats> statsByClubId = clubs.ToDictionary(
      club => club.Id,
      club => new ClubStats
      {
        ClubId = club.Id,
        ClubName = club.Name
      });

    foreach (Match match in matches)
    {
      if (match.DivisionId != divisionId || !match.IsPlayed)
      {
        continue;
      }

      if (!match.HomeScore.HasValue || !match.AwayScore.HasValue)
      {
        continue;
      }

      if (statsByClubId.TryGetValue(match.HomeClubId, out ClubStats? homeStats))
      {
        ApplyResult(homeStats, match.HomeScore.Value, match.AwayScore.Value);
      }

      if (statsByClubId.TryGetValue(match.AwayClubId, out ClubStats? awayStats))
      {
        ApplyResult(awayStats, match.AwayScore.Value, match.HomeScore.Value);
      }
    }

    return statsByClubId.Values
      .OrderByDescending(stats => stats.Points)
      .ThenByDescending(stats => stats.GoalDifference)
      .ThenByDescending(stats => stats.GoalsFor)
      .ThenBy(stats => stats.ClubName, StringComparer.OrdinalIgnoreCase)
      .Select((stats, index) => new StandingRowDto
      {
        Position = index + 1,
        ClubId = stats.ClubId,
        ClubName = stats.ClubName,
        Played = stats.Played,
        Won = stats.Won,
        Drawn = stats.Drawn,
        Lost = stats.Lost,
        GoalsFor = stats.GoalsFor,
        GoalsAgainst = stats.GoalsAgainst,
        GoalDifference = stats.GoalDifference,
        Points = stats.Points
      })
      .ToList();
  }

  private static void ApplyResult(ClubStats stats, int goalsFor, int goalsAgainst)
  {
    stats.Played += 1;
    stats.GoalsFor += goalsFor;
    stats.GoalsAgainst += goalsAgainst;

    if (goalsFor > goalsAgainst)
    {
      stats.Won += 1;
      return;
    }

    if (goalsFor < goalsAgainst)
    {
      stats.Lost += 1;
      return;
    }

    stats.Drawn += 1;
  }
}
