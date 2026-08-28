using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.Matches;
using Api.Features.Referees;
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
      include: query => query.Include(c => c.President),
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<Club> GetClubByIdIfExistAsync(
    Guid clubId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetByIdAsync(
      clubId,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kulüp bulunamadı.");
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

  public void EnsurePresidentExists(Club club)
  {
    if (club.President == null)
    {
      throw new BusinessException("Bu işlem için başkan bilgisi bulunamadı.");
    }
  }

  public void EnsurePresidentCanAffordLobby(Club club)
  {
    EnsurePresidentExists(club);

    if (club.President!.ReputationPoints < Options.LobbyFederationReputationCost)
    {
      throw new BusinessException("Federasyon yaklaşımı için yeterli meşruiyet puanı yok.");
    }
  }

  public void EnsurePresidentMeetsActionRequirements(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    string? reason = GetAttributeRequirementFailureReason(definition, president);

    if (reason != null)
    {
      throw new BusinessException(reason);
    }
  }

  public string? GetAttributeRequirementFailureReason(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    if (definition.MinCharisma <= 0 &&
        definition.MinAuthority <= 0 &&
        definition.MinIntegrity <= 0 &&
        definition.MinCunning <= 0 &&
        definition.MinConnections <= 0)
    {
      return null;
    }

    if (president == null)
    {
      return "Bu aksiyon için başkan bilgisi bulunamadı.";
    }

    if (definition.MinCharisma > 0 && president.Charisma < definition.MinCharisma)
    {
      return $"Needs Charisma {definition.MinCharisma}.";
    }

    if (definition.MinAuthority > 0 && president.Authority < definition.MinAuthority)
    {
      return $"Needs Authority {definition.MinAuthority}.";
    }

    if (definition.MinIntegrity > 0 && president.Integrity < definition.MinIntegrity)
    {
      return $"Needs Integrity {definition.MinIntegrity}.";
    }

    if (definition.MinCunning > 0 && president.Cunning < definition.MinCunning)
    {
      return $"Needs Cunning {definition.MinCunning}.";
    }

    if (definition.MinConnections > 0 && president.Connections < definition.MinConnections)
    {
      return $"Needs Connections {definition.MinConnections}.";
    }

    return null;
  }

  // Effective detection chance after Suspicion scaling and president affinity.
  public decimal CalculateDetectionChance(
    ClubActionDefinition definition,
    int currentSuspicion,
    ClubPresident? president = null)
  {
    if (!definition.IsShady)
    {
      return 0m;
    }

    GameOptions options = Options;
    decimal scaled = ClubScandalBusinessRules.CalculateDetectionChance(
      options,
      definition.BaseDetectionChance,
      currentSuspicion);
    scaled += GetPresidentDetectionAffinityDelta(definition, president);

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

  // Base success chance with referee personality and president affinity modifiers.
  public decimal CalculateSuccessChance(
    ClubActionDefinition definition,
    Match? match = null,
    ClubPresident? president = null)
  {
    decimal chance = definition.BaseSuccessChance;

    if (definition.Type == ClubActionType.IntimidateReferee && match?.Referee != null)
    {
      chance = ApplyIntimidatePersonalityModifier(chance, match.Referee.PersonalityType);
    }

    chance += GetPresidentSuccessAffinityDelta(definition, president);

    if (chance < 0m)
    {
      return 0m;
    }

    if (chance > 1m)
    {
      return 1m;
    }

    return Math.Round(chance, 4);
  }

  // Integrity boosts positive honorable squad effect sizes (levels above 1).
  // Motivational Talk is weakened slightly at high Infamy (pep-talk tax).
  public int ScaleHonorableEffectBonus(
    int baseBonus,
    ClubPresident? president,
    ClubActionType actionType)
  {
    if (president == null || baseBonus <= 0)
    {
      return baseBonus;
    }

    int levelsAboveBase = Math.Max(0, president.Integrity - ClubPresidentBusinessRules.AttributeMin);
    int bonus = baseBonus + levelsAboveBase * Options.PresidentIntegrityEffectBonusPerLevel;

    if (actionType == ClubActionType.MotivationalTalk && president.InfamyPoints > 0)
    {
      decimal infamyRatio = president.InfamyPoints / (decimal)ClubPresidentMoralityBusinessRules.MaxInfamy;
      decimal reduction = infamyRatio * Options.PresidentInfamyPepTalkMaxEffectReduction;
      decimal multiplier = 1m - reduction;
      bonus = (int)Math.Round(bonus * multiplier, MidpointRounding.AwayFromZero);
    }

    return Math.Max(0, bonus);
  }

  public decimal GetPromiseWinBonusAmount() => Options.PromiseWinBonusAmount;

  public decimal GetTapUpDiscountRatio() => Options.TapUpTransferFeeDiscountRatio;

  private decimal GetPresidentSuccessAffinityDelta(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    if (president == null)
    {
      return 0m;
    }

    GameOptions options = Options;
    int integrityLevels = Math.Max(0, president.Integrity - ClubPresidentBusinessRules.AttributeMin);
    int cunningLevels = Math.Max(0, president.Cunning - ClubPresidentBusinessRules.AttributeMin);

    if (definition.IsShady)
    {
      return cunningLevels * options.PresidentCunningShadySuccessBonusPerLevel
        - integrityLevels * options.PresidentIntegrityShadySuccessPenaltyPerLevel;
    }

    if (definition.Category == ClubActionCategory.Squad)
    {
      return integrityLevels * options.PresidentIntegrityHonorableSuccessBonusPerLevel;
    }

    return 0m;
  }

  private decimal GetPresidentDetectionAffinityDelta(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    if (!definition.IsShady || president == null)
    {
      return 0m;
    }

    GameOptions options = Options;
    int integrityLevels = Math.Max(0, president.Integrity - ClubPresidentBusinessRules.AttributeMin);
    int cunningLevels = Math.Max(0, president.Cunning - ClubPresidentBusinessRules.AttributeMin);

    return integrityLevels * options.PresidentIntegrityShadyDetectionPenaltyPerLevel
      - cunningLevels * options.PresidentCunningDetectionReductionPerLevel;
  }

  private decimal ApplyIntimidatePersonalityModifier(
    decimal baseChance,
    RefereePersonalityType personality)
  {
    GameOptions options = Options;

    decimal adjusted = personality switch
    {
      RefereePersonalityType.Strict => baseChance - options.IntimidateStrictSuccessPenalty,
      RefereePersonalityType.Showman => baseChance - options.IntimidateShowmanSuccessPenalty,
      RefereePersonalityType.Lenient => baseChance + options.IntimidateLenientSuccessBonus,
      RefereePersonalityType.Corruptible => baseChance + options.IntimidateCorruptibleSuccessBonus,
      _ => baseChance
    };

    return adjusted;
  }
}
