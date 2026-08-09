using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.Clubs;
using Api.Features.Matches;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.Actions;

public class ClubActionBusinessRules(
  IClubRepository _clubRepository,
  IMatchRepository _matchRepository,
  IOptions<GameOptions> _gameOptions)
{
  public GameOptions Options => _gameOptions.Value;

  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<Match?> GetNextUnplayedMatchForClubOrNullAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    List<Match> matches = await _matchRepository.GetAllAsync(
      filter: m =>
        !m.IsPlayed &&
        (m.HomeClubId == clubId || m.AwayClubId == clubId),
      include: query => query
        .Include(m => m.HomeClub)
        .Include(m => m.AwayClub)
        .Include(m => m.Referee),
      orderBy: query => query.OrderBy(m => m.MatchDate),
      cancellationToken: cancellationToken);

    return matches.FirstOrDefault();
  }

  public async Task<Match> GetMatchForActionAsync(
    Guid? matchId,
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    Match? match;

    if (matchId.HasValue)
    {
      match = await _matchRepository.GetByIdAsync(
        matchId.Value,
        include: query => query
          .Include(m => m.HomeClub)
          .Include(m => m.AwayClub)
          .Include(m => m.Referee),
        enableTracking: false,
        cancellationToken: cancellationToken);
    }
    else
    {
      match = await GetNextUnplayedMatchForClubOrNullAsync(clubId, cancellationToken);
    }

    if (match == null)
    {
      throw new NotFoundException("Aksiyon için uygun bir maç bulunamadı.");
    }

    return match;
  }

  public void MatchMustBeUnplayed(Match match)
  {
    if (match.IsPlayed)
    {
      throw new BusinessException("Oynanmış maçlar için aksiyon gerçekleştirilemez.");
    }
  }

  public void MatchMustBelongToClub(Match match, Guid clubId)
  {
    if (match.HomeClubId != clubId && match.AwayClubId != clubId)
    {
      throw new BusinessException("Bu maç kulübünüze ait değil.");
    }
  }

  public void ClubMustAfford(Club club, decimal cost)
  {
    if (club.Cash < cost)
    {
      throw new BusinessException("Kulüp kasası bu aksiyonu karşılamaya yetmiyor.");
    }
  }

  // Effective detection chance after scaling by the club's current Suspicion.
  public decimal CalculateDetectionChance(ClubActionDefinition definition, int currentSuspicion)
  {
    if (!definition.IsShady)
    {
      return 0m;
    }

    GameOptions options = Options;
    decimal scaled = definition.BaseDetectionChance + currentSuspicion * options.SuspicionDetectionScale;

    if (scaled < 0m)
    {
      return 0m;
    }

    if (scaled > options.SuspicionMaxDetectionChance)
    {
      return options.SuspicionMaxDetectionChance;
    }

    return Math.Round(scaled, 4);
  }

  // Base success chance. Kept as an extension point for per-action modifiers
  // (referee personality, opponent strength, etc.) added in later steps.
  public decimal CalculateSuccessChance(ClubActionDefinition definition)
  {
    return Math.Round(definition.BaseSuccessChance, 4);
  }

  public int ApplyHeat(Club club, ClubActionDefinition definition)
  {
    if (!definition.IsShady || definition.HeatGenerated <= 0)
    {
      return 0;
    }

    int newSuspicion = Math.Clamp(
      club.Suspicion + definition.HeatGenerated,
      0,
      Options.MaxSuspicion);

    int applied = newSuspicion - club.Suspicion;
    club.Suspicion = newSuspicion;

    return applied;
  }
}
