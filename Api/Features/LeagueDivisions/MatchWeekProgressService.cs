using Api.Core.Options;
using Api.Core.Repositories;
using Api.Features.Matches;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Options;

namespace Api.Features.LeagueDivisions;

public class MatchWeekProgressService(
  ILeagueDivisionRepository _leagueDivisionRepository,
  IMatchRepository _matchRepository,
  IUnitOfWork _unitOfWork,
  IOptions<GameOptions> _gameOptions,
  HybridCache _cache) : IMatchWeekProgressService
{
  private const string LeagueCacheTag = "league-divisions";

  public Task<bool> TryAdvanceAfterMatchAsync(
    Match match,
    CancellationToken cancellationToken = default)
  {
    return TryAdvanceIfWeekCompleteAsync(
      match.DivisionId,
      match.Season,
      match.MatchWeek,
      cancellationToken);
  }

  public async Task<bool> TryAdvanceIfWeekCompleteAsync(
    int divisionId,
    int season,
    int completedMatchWeek,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? division = await _leagueDivisionRepository.GetByIdAsync(
      divisionId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (division == null)
    {
      return false;
    }

    if (division.CurrentMatchWeek != completedMatchWeek)
    {
      return false;
    }

    if (division.CurrentMatchWeek >= _gameOptions.Value.MaximumMatchWeek)
    {
      return false;
    }

    bool hasUnplayedInWeek = await _matchRepository.AnyAsync(
      match =>
        match.DivisionId == divisionId &&
        match.Season == season &&
        match.MatchWeek == completedMatchWeek &&
        !match.IsPlayed,
      cancellationToken);

    if (hasUnplayedInWeek)
    {
      return false;
    }

    division.CurrentMatchWeek++;
    _leagueDivisionRepository.Update(division);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
    await _cache.RemoveByTagAsync(LeagueCacheTag, cancellationToken);

    return true;
  }
}
