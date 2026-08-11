using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.Clubs;
using Microsoft.Extensions.Options;

namespace Api.Features.Matches;

public class MatchSettlementGate(
  IMatchRepository _matchRepository,
  IOptions<GameOptions> _gameOptions) : IMatchSettlementGate
{
  public async Task<ClubPublicView> GetPublicViewAsync(
    Club club,
    CancellationToken cancellationToken = default)
  {
    IReadOnlyDictionary<Guid, ClubPublicView> views = await GetPublicViewsAsync(
      [club],
      cancellationToken);

    return views[club.Id];
  }

  public async Task<IReadOnlyDictionary<Guid, ClubPublicView>> GetPublicViewsAsync(
    IReadOnlyList<Club> clubs,
    CancellationToken cancellationToken = default)
  {
    Dictionary<Guid, ClubPublicView> views = new();

    if (clubs.Count == 0)
    {
      return views;
    }

    DateTime utcNow = DateTime.UtcNow;
    int liveDurationSeconds = _gameOptions.Value.MatchLiveReplayDurationSeconds;
    DateTime earliestLiveMatchDate = utcNow.AddSeconds(-liveDurationSeconds);
    List<Guid> clubIds = clubs.Select(club => club.Id).Distinct().ToList();

    List<Match> matches = await _matchRepository.GetAllAsync(
      filter: match =>
        (clubIds.Contains(match.HomeClubId) || clubIds.Contains(match.AwayClubId)) &&
        match.MatchDate <= utcNow &&
        (!match.IsPlayed || match.MatchDate > earliestLiveMatchDate),
      orderBy: query => query.OrderByDescending(match => match.MatchDate),
      cancellationToken: cancellationToken);

    Dictionary<Guid, Match> blockingByClubId = new();

    foreach (Match match in matches)
    {
      if (!MatchLiveWindow.ShouldLockSpend(match, utcNow, liveDurationSeconds))
      {
        continue;
      }

      TryAssignBlockingMatch(blockingByClubId, match.HomeClubId, match);
      TryAssignBlockingMatch(blockingByClubId, match.AwayClubId, match);
    }

    foreach (Club club in clubs)
    {
      blockingByClubId.TryGetValue(club.Id, out Match? blockingMatch);
      views[club.Id] = BuildPublicView(club, blockingMatch, utcNow, liveDurationSeconds);
    }

    return views;
  }

  public async Task MustAllowClubSpendAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    DateTime utcNow = DateTime.UtcNow;
    int liveDurationSeconds = _gameOptions.Value.MatchLiveReplayDurationSeconds;

    List<Match> matches = await _matchRepository.GetAllAsync(
      filter: m =>
        (m.HomeClubId == clubId || m.AwayClubId == clubId) &&
        m.MatchDate <= utcNow &&
        (!m.IsPlayed || m.MatchDate > utcNow.AddSeconds(-liveDurationSeconds)),
      orderBy: query => query.OrderByDescending(m => m.MatchDate),
      cancellationToken: cancellationToken);

    Match? match = matches.FirstOrDefault();

    if (match == null)
    {
      return;
    }

    if (!MatchLiveWindow.ShouldLockSpend(match, utcNow, liveDurationSeconds))
    {
      return;
    }

    throw new BusinessException(MatchLiveWindow.SpendLockedExceptionMessage);
  }

  public void ConcealPreviewScores(
    IReadOnlyList<Match> matches,
    List<MatchPreviewDto> previews)
  {
    int count = Math.Min(matches.Count, previews.Count);

    for (int i = 0; i < count; i++)
    {
      if (!ShouldHideScores(matches[i]))
      {
        continue;
      }

      previews[i] = previews[i] with
      {
        HomeScore = null,
        AwayScore = null
      };
    }
  }

  public void ConcealResponseScores(
    IReadOnlyList<Match> matches,
    List<MatchResponseDto> responses)
  {
    int count = Math.Min(matches.Count, responses.Count);

    for (int i = 0; i < count; i++)
    {
      if (!ShouldHideScores(matches[i]))
      {
        continue;
      }

      responses[i] = responses[i] with
      {
        HomeScore = null,
        AwayScore = null,
        MatchLogJson = null
      };
    }
  }

  public bool ShouldHideScores(Match match)
  {
    return MatchLiveWindow.ShouldHideScores(
      match,
      DateTime.UtcNow,
      _gameOptions.Value.MatchLiveReplayDurationSeconds);
  }

  private static void TryAssignBlockingMatch(
    Dictionary<Guid, Match> blockingByClubId,
    Guid clubId,
    Match match)
  {
    if (blockingByClubId.ContainsKey(clubId))
    {
      return;
    }

    blockingByClubId[clubId] = match;
  }

  private static ClubPublicView BuildPublicView(
    Club club,
    Match? blockingMatch,
    DateTime utcNow,
    int liveDurationSeconds)
  {
    bool cashSpendLocked = blockingMatch != null &&
      MatchLiveWindow.ShouldLockSpend(blockingMatch, utcNow, liveDurationSeconds);

    decimal cash = club.Cash;
    int morale = club.Morale;
    int suspicion = club.Suspicion;

    if (blockingMatch != null &&
      MatchLiveWindow.ShouldConcealSettlement(blockingMatch, utcNow, liveDurationSeconds))
    {
      if (blockingMatch.HomeClubId == club.Id)
      {
        if (blockingMatch.HomeCashBefore.HasValue)
        {
          cash = blockingMatch.HomeCashBefore.Value;
        }

        if (blockingMatch.HomeMoraleBefore.HasValue)
        {
          morale = blockingMatch.HomeMoraleBefore.Value;
        }

        if (blockingMatch.HomeSuspicionBefore.HasValue)
        {
          suspicion = blockingMatch.HomeSuspicionBefore.Value;
        }
      }
      else if (blockingMatch.AwayClubId == club.Id)
      {
        if (blockingMatch.AwayCashBefore.HasValue)
        {
          cash = blockingMatch.AwayCashBefore.Value;
        }

        if (blockingMatch.AwayMoraleBefore.HasValue)
        {
          morale = blockingMatch.AwayMoraleBefore.Value;
        }

        if (blockingMatch.AwaySuspicionBefore.HasValue)
        {
          suspicion = blockingMatch.AwaySuspicionBefore.Value;
        }
      }
    }

    return new ClubPublicView(cash, morale, suspicion, cashSpendLocked);
  }
}
