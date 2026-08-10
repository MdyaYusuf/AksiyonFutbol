using Api.Features.Bribery;
using Api.Features.Matches;

namespace Api.Features.Actions;

/// <summary>
/// Builds match influence from successful referee bribes and successful match-scoped
/// ClubActions. Bribery still owns its own attempt records; this provider folds them in.
/// </summary>
public class MatchInfluenceProvider(
  IBribeAttemptRepository _bribeAttemptRepository,
  IClubActionRepository _clubActionRepository) : IMatchInfluenceProvider
{
  public async Task<MatchInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    List<BribeAttempt> successfulBribes = await _bribeAttemptRepository.GetAllAsync(
      filter: a =>
        a.MatchId == matchId &&
        a.Outcome == BribeAttemptOutcome.Succeeded,
      cancellationToken: cancellationToken);

    List<ClubAction> successfulActions = await _clubActionRepository.GetAllAsync(
      filter: a =>
        a.MatchId == matchId &&
        a.Outcome == ClubActionOutcome.Succeeded,
      cancellationToken: cancellationToken);

    HashSet<Guid> favoredClubIds = successfulBribes
      .Select(a => a.ClubId)
      .ToHashSet();

    HashSet<Guid> matchFixingClubIds = new();
    HashSet<Guid> espionageClubIds = new();

    foreach (ClubAction action in successfulActions)
    {
      switch (action.ActionType)
      {
        case ClubActionType.IntimidateReferee:
          favoredClubIds.Add(action.ClubId);
          break;
        case ClubActionType.MatchFixing:
          matchFixingClubIds.Add(action.ClubId);
          break;
        case ClubActionType.Espionage:
          espionageClubIds.Add(action.ClubId);
          break;
      }
    }

    if (favoredClubIds.Count == 0 &&
        matchFixingClubIds.Count == 0 &&
        espionageClubIds.Count == 0)
    {
      return MatchInfluence.None;
    }

    return new MatchInfluence
    {
      FavoredClubIds = favoredClubIds,
      MatchFixingClubIds = matchFixingClubIds,
      EspionageClubIds = espionageClubIds
    };
  }
}
