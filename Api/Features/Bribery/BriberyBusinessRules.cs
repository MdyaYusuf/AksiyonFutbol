using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.ClubPresidents;
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
      throw new BusinessException("Oynanmış maçlar için maç etkisi girişiminde bulunulamaz.");
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
      throw new BusinessException("Maç etkisi için maça hakem atanmış olmalıdır.");
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
      throw new BusinessException("Bu maç için zaten bir etki girişiminde bulunulmuş.");
    }
  }

  public void ClubMustAffordBribe(Club club, decimal amount)
  {
    if (club.Cash < amount)
    {
      throw new BusinessException("Kulüp kasası bu yaklaşım tutarını karşılamaya yetmiyor.");
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

  public (decimal Low, decimal Medium, decimal High) ResolveStakeAmounts(
    decimal minAmount,
    decimal maxAmount)
  {
    decimal span = maxAmount - minAmount;

    return (
      Math.Round(minAmount),
      Math.Round(minAmount + span * 0.4m),
      Math.Round(maxAmount));
  }

  public BribeStakeTier ResolveStakeTier(decimal amount, decimal minAmount, decimal maxAmount)
  {
    (decimal low, decimal medium, decimal high) = ResolveStakeAmounts(minAmount, maxAmount);

    if (amount >= high)
    {
      return BribeStakeTier.High;
    }

    if (amount >= medium)
    {
      return BribeStakeTier.Medium;
    }

    return BribeStakeTier.Low;
  }

  public int GetHeatForTier(BribeStakeTier tier)
  {
    GameOptions options = Options;

    return tier switch
    {
      BribeStakeTier.Low => options.BribeLowHeatGenerated,
      BribeStakeTier.Medium => options.BribeMediumHeatGenerated,
      BribeStakeTier.High => options.BribeHighHeatGenerated,
      _ => options.BribeLowHeatGenerated
    };
  }

  public decimal GetBaseDetectionForTier(BribeStakeTier tier)
  {
    GameOptions options = Options;

    return tier switch
    {
      BribeStakeTier.Low => options.BribeLowBaseDetectionChance,
      BribeStakeTier.Medium => options.BribeMediumBaseDetectionChance,
      BribeStakeTier.High => options.BribeHighBaseDetectionChance,
      _ => options.BribeLowBaseDetectionChance
    };
  }

  public decimal CalculateDetectionChance(
    decimal baseDetectionChance,
    int currentSuspicion,
    ClubPresident? president = null)
  {
    decimal scaled = ClubScandalBusinessRules.CalculateDetectionChance(
      Options,
      baseDetectionChance,
      currentSuspicion);
    scaled += GetPresidentDetectionAffinityDelta(president);

    if (scaled < 0m)
    {
      return 0m;
    }

    if (scaled > Options.SuspicionMaxDetectionChance)
    {
      return Options.SuspicionMaxDetectionChance;
    }

    return Math.Round(scaled, 4);
  }

  public List<BriberyStakeOptionDto> BuildStakeOptions(
    decimal minAmount,
    decimal maxAmount,
    int suspicion,
    Referee referee,
    ClubPresident? president)
  {
    (decimal low, decimal medium, decimal high) = ResolveStakeAmounts(minAmount, maxAmount);

    BribeStakeTier[] tiers =
    [
      BribeStakeTier.Low,
      BribeStakeTier.Medium,
      BribeStakeTier.High
    ];

    decimal[] amounts = [low, medium, high];
    List<BriberyStakeOptionDto> options = [];

    for (int i = 0; i < tiers.Length; i++)
    {
      BribeStakeTier tier = tiers[i];
      decimal amount = amounts[i];
      decimal baseDetection = GetBaseDetectionForTier(tier);
      (string title, string description) = BriberyStakeCatalog.GetCopy(tier);

      options.Add(new BriberyStakeOptionDto
      {
        Tier = tier.ToString().ToLowerInvariant(),
        Title = title,
        Description = description,
        Amount = amount,
        SuccessChance = CalculateSuccessChance(amount, referee),
        BaseDetectionChance = baseDetection,
        DetectionChance = CalculateDetectionChance(baseDetection, suspicion, president),
        HeatGenerated = GetHeatForTier(tier)
      });
    }

    return options;
  }

  private decimal GetPresidentDetectionAffinityDelta(ClubPresident? president)
  {
    if (president == null)
    {
      return 0m;
    }

    GameOptions options = Options;
    int integrityLevels = Math.Max(0, president.Integrity - ClubPresidentBusinessRules.AttributeMin);
    int cunningLevels = Math.Max(0, president.Cunning - ClubPresidentBusinessRules.AttributeMin);

    return integrityLevels * options.PresidentIntegrityShadyDetectionPenaltyPerLevel
      - cunningLevels * options.PresidentCunningDetectionReductionPerLevel;
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
