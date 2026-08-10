using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.Clubs;
using Api.Features.Matches;
using Api.Features.Referees;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.Bribery;

public class BriberyBusinessRules(
  IClubRepository _clubRepository,
  IMatchRepository _matchRepository,
  IBribeAttemptRepository _bribeAttemptRepository,
  IOptions<GameOptions> _gameOptions)
{
  public GameOptions Options => _gameOptions.Value;

  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      include,
      enableTracking,
      cancellationToken);

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

  public async Task<Match> GetNextUnplayedMatchForClubAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    Match? match = await GetNextUnplayedMatchForClubOrNullAsync(clubId, cancellationToken);

    if (match == null)
    {
      throw new NotFoundException("Kulüp için yaklaşan bir maç bulunamadı.");
    }

    return match;
  }

  public async Task<Match> GetMatchIfExistAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    Match? match = await _matchRepository.GetByIdAsync(
      matchId,
      include: query => query
        .Include(m => m.HomeClub)
        .Include(m => m.AwayClub)
        .Include(m => m.Referee),
      enableTracking: false,
      cancellationToken: cancellationToken);

    if (match == null)
    {
      throw new NotFoundException($"{matchId} numaralı maç bulunamadı.");
    }

    return match;
  }

  public void MatchMustBeUnplayed(Match match)
  {
    if (match.IsPlayed)
    {
      throw new BusinessException("Oynanmış maçlar için rüşvet girişiminde bulunulamaz.");
    }
  }

  public void MatchMustBelongToClub(Match match, Guid clubId)
  {
    if (match.HomeClubId != clubId && match.AwayClubId != clubId)
    {
      throw new BusinessException("Bu maç kulübünüze ait değil.");
    }
  }

  public void MatchMustHaveReferee(Match match)
  {
    if (!match.RefereeId.HasValue || match.Referee == null)
    {
      throw new BusinessException("Rüşvet için maça hakem atanmış olmalıdır.");
    }
  }

  public async Task EnsureNoExistingAttemptAsync(
    Guid clubId,
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    bool exists = await _bribeAttemptRepository.AnyAsync(
      a => a.ClubId == clubId && a.MatchId == matchId,
      cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu maç için zaten bir rüşvet girişiminde bulunulmuş.");
    }
  }

  public void ClubMustAffordBribe(Club club, decimal amount)
  {
    if (club.Cash < amount)
    {
      throw new BusinessException("Kulüp kasası bu rüşvet tutarını karşılamaya yetmiyor.");
    }
  }

  public decimal CalculateSuccessChance(decimal amount, Referee referee)
  {
    GameOptions options = Options;
    decimal difficulty = Math.Max(1, referee.BriberyDifficulty);
    decimal rawChance = amount / (difficulty * options.BribeDifficultyCashScale);

    if (referee.PersonalityType == RefereePersonalityType.Corruptible)
    {
      rawChance += options.BribeCorruptibleBonus;
    }

    if (rawChance < options.BribeMinSuccessChance)
    {
      return options.BribeMinSuccessChance;
    }

    if (rawChance > options.BribeMaxSuccessChance)
    {
      return options.BribeMaxSuccessChance;
    }

    return Math.Round(rawChance, 4);
  }

  public Func<IQueryable<BribeAttempt>, IQueryable<BribeAttempt>> AttemptDetailInclude()
  {
    return query => query
      .Include(a => a.Club)
      .Include(a => a.Match)
        .ThenInclude(m => m.HomeClub)
      .Include(a => a.Match)
        .ThenInclude(m => m.AwayClub)
      .Include(a => a.Referee);
  }
}
