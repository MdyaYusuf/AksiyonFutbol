using Api.Features.Matches;
using Api.Features.Referees;

namespace Api.Features.Bribery;

public class BriberyMapper
{
  public BribeAttemptResponseDto EntityToResponseDto(BribeAttempt attempt)
  {
    return new BribeAttemptResponseDto
    {
      Id = attempt.Id,
      ClubId = attempt.ClubId,
      ClubName = attempt.Club.Name,
      MatchId = attempt.MatchId,
      MatchWeek = attempt.Match.MatchWeek,
      HomeClubName = attempt.Match.HomeClub.Name,
      AwayClubName = attempt.Match.AwayClub.Name,
      RefereeId = attempt.RefereeId,
      RefereeName = attempt.Referee.Name,
      BriberyDifficulty = attempt.Referee.BriberyDifficulty,
      Amount = attempt.Amount,
      SuccessChance = attempt.SuccessChance,
      Outcome = attempt.Outcome,
      CreatedDate = attempt.CreatedDate
    };
  }

  public BriberyContextResponseDto ToUnavailableContextDto(
    ClubContext club,
    string unavailableReason,
    decimal minAmount,
    decimal maxAmount)
  {
    return new BriberyContextResponseDto
    {
      ClubId = club.Id,
      ClubName = club.Name,
      ClubCash = club.Cash,
      CanAttempt = false,
      UnavailableReason = unavailableReason,
      MinAmount = minAmount,
      MaxAmount = maxAmount
    };
  }

  public BriberyContextResponseDto ToContextDto(
    ClubContext club,
    Match match,
    Referee referee,
    bool alreadyAttempted,
    BribeAttemptOutcome? existingOutcome,
    decimal estimatedSuccessChance,
    decimal minAmount,
    decimal maxAmount)
  {
    bool isHome = match.HomeClubId == club.Id;

    return new BriberyContextResponseDto
    {
      ClubId = club.Id,
      ClubName = club.Name,
      ClubCash = club.Cash,
      CanAttempt = true,
      MatchId = match.Id,
      MatchWeek = match.MatchWeek,
      MatchDate = match.MatchDate,
      HomeClubId = match.HomeClubId,
      HomeClubName = match.HomeClub.Name,
      AwayClubId = match.AwayClubId,
      AwayClubName = match.AwayClub.Name,
      IsHome = isHome,
      RefereeId = referee.Id,
      RefereeName = referee.Name,
      BriberyDifficulty = referee.BriberyDifficulty,
      RefereePersonality = referee.PersonalityType.ToString(),
      AlreadyAttempted = alreadyAttempted,
      ExistingOutcome = existingOutcome,
      EstimatedSuccessChance = estimatedSuccessChance,
      MinAmount = minAmount,
      MaxAmount = maxAmount
    };
  }
}

public sealed record ClubContext(Guid Id, string Name, decimal Cash);
