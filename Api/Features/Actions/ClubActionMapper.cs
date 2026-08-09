using Api.Features.Matches;

namespace Api.Features.Actions;

public class ClubActionMapper
{
  public ClubActionDto ToDto(ClubAction action)
  {
    ClubActionMetadata metadata = ClubActionCatalog.Get(action.ActionType);

    return new ClubActionDto
    {
      Id = action.Id,
      ActionType = action.ActionType,
      Category = metadata.Category,
      DisplayName = metadata.DisplayName,
      MatchId = action.MatchId,
      MatchWeek = action.Match?.MatchWeek,
      Outcome = action.Outcome,
      WasDetected = action.WasDetected,
      HeatGenerated = action.HeatGenerated,
      CashSpent = action.CashSpent,
      SuccessChance = action.SuccessChance,
      DetectionChance = action.DetectionChance,
      CreatedDate = action.CreatedDate
    };
  }

  public ClubActionResultDto ToResultDto(ClubAction action, decimal newCash, int newSuspicion)
  {
    return new ClubActionResultDto
    {
      Action = ToDto(action),
      NewCash = newCash,
      NewSuspicion = newSuspicion
    };
  }

  public UpcomingMatchSummaryDto ToUpcomingMatchSummary(Match match, Guid clubId)
  {
    return new UpcomingMatchSummaryDto
    {
      MatchId = match.Id,
      MatchWeek = match.MatchWeek,
      MatchDate = match.MatchDate,
      HomeClubId = match.HomeClubId,
      HomeClubName = match.HomeClub.Name,
      AwayClubId = match.AwayClubId,
      AwayClubName = match.AwayClub.Name,
      IsHome = match.HomeClubId == clubId
    };
  }
}
