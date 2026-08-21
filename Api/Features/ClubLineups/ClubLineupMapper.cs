using Api.Features.PlayerInstances;

namespace Api.Features.ClubLineups;

public class ClubLineupMapper
{
  public ClubLineupResponseDto EntityToResponseDto(ClubLineup lineup)
  {
    List<ClubLineupSelection> orderedSelections = lineup.Selections
      .OrderByDescending(s => s.IsStarter)
      .ThenBy(s => s.SortOrder)
      .ToList();

    return new ClubLineupResponseDto
    {
      Id = lineup.Id,
      ClubId = lineup.ClubId,
      ClubName = lineup.Club.DisplayName,
      Formation = lineup.Formation,
      Mentality = lineup.Mentality,
      Starters = orderedSelections
        .Where(s => s.IsStarter)
        .Select(ToPlayerDto)
        .ToList(),
      Bench = orderedSelections
        .Where(s => !s.IsStarter)
        .Select(ToPlayerDto)
        .ToList(),
      CreatedDate = lineup.CreatedDate,
      UpdatedDate = lineup.UpdatedDate
    };
  }

  private static ClubLineupPlayerDto ToPlayerDto(ClubLineupSelection selection)
  {
    PlayerInstance player = selection.PlayerInstance;

    return new ClubLineupPlayerDto
    {
      PlayerInstanceId = player.Id,
      FirstName = player.FirstName,
      LastName = player.LastName,
      Position = player.Position.ToString(),
      OverallRating = PlayerInstanceRatingCalculator.Calculate(player),
      IsInjured = player.IsInjured,
      SortOrder = selection.SortOrder
    };
  }
}
