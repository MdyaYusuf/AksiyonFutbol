using Api.Features.Clubs;
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
      TargetPlayerInstanceId = action.TargetPlayerInstanceId,
      TargetPlayerName = action.TargetPlayerInstance == null
        ? null
        : $"{action.TargetPlayerInstance.FirstName} {action.TargetPlayerInstance.LastName}",
      Outcome = action.Outcome,
      WasDetected = action.WasDetected,
      HeatGenerated = action.HeatGenerated,
      CashSpent = action.CashSpent,
      SuccessChance = action.SuccessChance,
      DetectionChance = action.DetectionChance,
      FineAmount = action.FineAmount,
      ScandalMoralePenaltyApplied = action.ScandalMoralePenaltyApplied,
      ScandalReputationPenaltyApplied = action.ScandalReputationPenaltyApplied,
      MatchPenaltyApplied = action.MatchPenaltyApplied,
      CreatedDate = action.CreatedDate
    };
  }

  public ClubActionResultDto ToResultDto(
    ClubAction action,
    Club club,
    ClubScandalConsequence? investigation = null)
  {
    return new ClubActionResultDto
    {
      Action = ToDto(action),
      NewCash = club.Cash,
      NewSuspicion = club.Suspicion,
      NewMorale = club.Morale,
      NewChemistry = club.Chemistry,
      NewDiscipline = club.Discipline,
      NewReputationPoints = club.President?.ReputationPoints,
      NewInfamyPoints = club.President?.InfamyPoints,
      Investigation = investigation == null
        ? null
        : new InvestigationConsequenceDto
        {
          FineAmount = investigation.FineAmount,
          MoralePenalty = investigation.MoralePenalty,
          ReputationPenalty = investigation.ReputationPenalty,
          InfamyGain = investigation.InfamyGain,
          MatchPenaltyApplied = investigation.MatchPenaltyApplied
        }
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
      HomeClubName = match.HomeClub.DisplayName,
      AwayClubId = match.AwayClubId,
      AwayClubName = match.AwayClub.DisplayName,
      IsHome = match.HomeClubId == clubId
    };
  }
}
