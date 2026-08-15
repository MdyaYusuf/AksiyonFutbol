using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.SeasonTransitions;

public class SeasonTransitionBusinessRules(
  ILeagueDivisionRepository _leagueDivisionRepository,
  IClubRepository _clubRepository,
  IMatchRepository _matchRepository,
  LeagueDivisionBusinessRules _leagueBusinessRules,
  IOptions<GameOptions> _gameOptions)
{
  public GameOptions Options => _gameOptions.Value;

  public async Task EnsureCanManageSeasonEndAsync(
    string userRole,
    Guid currentUserId,
    int groupNumber,
    CancellationToken cancellationToken = default)
  {
    if (userRole == "Admin")
    {
      return;
    }

    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == currentUserId,
      include: query => query
        .Include(c => c.President)
        .Include(c => c.Division),
      cancellationToken: cancellationToken);

    if (club == null || club.Division == null || club.Division.GroupNumber != groupNumber)
    {
      throw new ForbiddenException("Bu sezon sonu işlemi için yetkiniz bulunmamaktadır.");
    }
  }

  public async Task<LeagueDivision> GetDivisionAsync(
    int divisionId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    return await _leagueBusinessRules.GetLeagueDivisionIfExistAsync(
      divisionId,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);
  }

  public async Task<List<LeagueDivision>> GetGroupLadderAsync(
    int groupNumber,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    List<LeagueDivision> divisions = await _leagueDivisionRepository.GetAllAsync(
      filter: d => d.GroupNumber == groupNumber,
      orderBy: query => query.OrderBy(d => d.Tier),
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (divisions.Count == 0)
    {
      throw new NotFoundException($"{groupNumber} numaralı grup için lig bulunamadı.");
    }

    return divisions;
  }

  public async Task<List<Club>> GetClubsForDivisionAsync(
    int divisionId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    return await _clubRepository.GetAllAsync(
      filter: c => c.DivisionId == divisionId,
      orderBy: query => query.OrderBy(c => c.Name),
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);
  }

  public async Task<List<Match>> GetPlayedMatchesForDivisionAsync(
    int divisionId,
    CancellationToken cancellationToken = default)
  {
    return await _matchRepository.GetAllAsync(
      filter: m =>
        m.DivisionId == divisionId &&
        m.IsPlayed &&
        m.HomeScore != null &&
        m.AwayScore != null,
      cancellationToken: cancellationToken);
  }

  public async Task EnsureDivisionSeasonCompleteAsync(
    LeagueDivision division,
    CancellationToken cancellationToken = default)
  {
    if (division.CurrentMatchWeek < Options.MaximumMatchWeek)
    {
      throw new BusinessException(
        $"{division.Name} henüz sezonun son haftasında değil (hafta {division.CurrentMatchWeek}/{Options.MaximumMatchWeek}).");
    }

    bool hasUnplayed = await _matchRepository.AnyAsync(
      m => m.DivisionId == division.Id && !m.IsPlayed,
      cancellationToken);

    if (hasUnplayed)
    {
      throw new BusinessException(
        $"{division.Name} liginde oynanmamış maçlar varken sezon sonu işlenemez.");
    }
  }

  public int ResolveSwapSlots(int higherClubCount, int lowerClubCount)
  {
    int configured = Math.Min(Options.PromotionSlots, Options.RelegationSlots);

    if (configured < 1)
    {
      return 0;
    }

    return Math.Min(configured, Math.Min(higherClubCount, lowerClubCount));
  }

  public void EnsureProjectedCapacity(
    Dictionary<int, int> projectedCountsByDivisionId)
  {
    int maxClubs = Options.MaximumClubsPerDivision;

    foreach ((int divisionId, int count) in projectedCountsByDivisionId)
    {
      if (count > maxClubs)
      {
        throw new BusinessException(
          $"Sezon sonu hareketleri {divisionId} numaralı ligi kapasite sınırının ({maxClubs}) üzerine çıkarır.");
      }
    }
  }
}
