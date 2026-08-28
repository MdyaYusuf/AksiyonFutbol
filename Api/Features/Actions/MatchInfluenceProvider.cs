using Api.Features.Bribery;
using Api.Features.Matches;
using Api.Features.Referees;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Actions;

/// <summary>
/// Builds match influence from successful referee bribes and match-scoped ClubActions.
/// Bribery still owns its own attempt records; this provider folds them in.
/// Failed intimidation against Strict/Showman referees reverses favor onto the opponent.
/// </summary>
public class MatchInfluenceProvider(
  IBribeAttemptRepository _bribeAttemptRepository,
  IClubActionRepository _clubActionRepository,
  IMatchRepository _matchRepository) : IMatchInfluenceProvider
{
  public async Task<MatchInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    Match? match = await _matchRepository.GetByIdAsync(
      matchId,
      include: query => query.Include(m => m.Referee),
      cancellationToken: cancellationToken);

    if (match == null)
    {
      return MatchInfluence.None;
    }

    List<BribeAttempt> successfulBribes = await _bribeAttemptRepository.GetAllAsync(
      filter: a =>
        a.MatchId == matchId &&
        a.Outcome == BribeAttemptOutcome.Succeeded &&
        !a.WasDetected,
      cancellationToken: cancellationToken);

    List<ClubAction> matchActions = await _clubActionRepository.GetAllAsync(
      filter: a => a.MatchId == matchId,
      cancellationToken: cancellationToken);

    HashSet<Guid> favoredClubIds = successfulBribes
      .Select(a => a.ClubId)
      .ToHashSet();

    HashSet<Guid> matchFixingClubIds = new();
    HashSet<Guid> espionageClubIds = new();
    HashSet<Guid> espionageTierIIClubIds = new();
    HashSet<Guid> dopingClubIds = new();
    HashSet<Guid> sabotageClubIds = new();
    HashSet<Guid> matchPenaltyClubIds = new();

    RefereePersonalityType? refereePersonality = match.Referee?.PersonalityType;

    foreach (ClubAction action in matchActions)
    {
      switch (action.ActionType)
      {
        case ClubActionType.IntimidateReferee:
          ApplyIntimidateInfluence(
            action,
            match,
            refereePersonality,
            favoredClubIds);
          break;
        case ClubActionType.MatchFixing:
          if (action.WasDetected || action.MatchPenaltyApplied)
          {
            matchPenaltyClubIds.Add(action.ClubId);
          }
          else if (action.Outcome == ClubActionOutcome.Succeeded)
          {
            matchFixingClubIds.Add(action.ClubId);
          }

          break;
        case ClubActionType.Espionage when action.Outcome == ClubActionOutcome.Succeeded:
          espionageClubIds.Add(action.ClubId);
          break;
        case ClubActionType.EspionageII when action.Outcome == ClubActionOutcome.Succeeded:
          espionageTierIIClubIds.Add(action.ClubId);
          break;
        case ClubActionType.Doping:
          if (action.WasDetected || action.MatchPenaltyApplied)
          {
            matchPenaltyClubIds.Add(action.ClubId);
          }
          else if (action.Outcome == ClubActionOutcome.Succeeded)
          {
            dopingClubIds.Add(action.ClubId);
          }

          break;
        case ClubActionType.Sabotage when action.Outcome == ClubActionOutcome.Succeeded:
          sabotageClubIds.Add(action.ClubId);
          break;
      }
    }

    if (favoredClubIds.Count == 0 &&
        matchFixingClubIds.Count == 0 &&
        espionageClubIds.Count == 0 &&
        espionageTierIIClubIds.Count == 0 &&
        dopingClubIds.Count == 0 &&
        sabotageClubIds.Count == 0 &&
        matchPenaltyClubIds.Count == 0)
    {
      return MatchInfluence.None;
    }

    return new MatchInfluence
    {
      FavoredClubIds = favoredClubIds,
      MatchFixingClubIds = matchFixingClubIds,
      EspionageClubIds = espionageClubIds,
      EspionageTierIIClubIds = espionageTierIIClubIds,
      DopingClubIds = dopingClubIds,
      SabotageClubIds = sabotageClubIds,
      MatchPenaltyClubIds = matchPenaltyClubIds
    };
  }

  private static void ApplyIntimidateInfluence(
    ClubAction action,
    Match match,
    RefereePersonalityType? refereePersonality,
    HashSet<Guid> favoredClubIds)
  {
    if (action.Outcome == ClubActionOutcome.Succeeded)
    {
      favoredClubIds.Add(action.ClubId);
      return;
    }

    if (action.Outcome != ClubActionOutcome.Failed)
    {
      return;
    }

    if (refereePersonality != RefereePersonalityType.Strict &&
        refereePersonality != RefereePersonalityType.Showman)
    {
      return;
    }

    // Backfire: the referee sides with the opponent instead.
    Guid opponentId = action.ClubId == match.HomeClubId
      ? match.AwayClubId
      : match.HomeClubId;
    favoredClubIds.Add(opponentId);
  }
}
