using Api.Core.Exceptions;
using Api.Core.Options;
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

  // Base success chance, with per-action modifiers (e.g. referee personality for intimidation).
  public decimal CalculateSuccessChance(ClubActionDefinition definition, Match? match = null)
  {
    decimal chance = definition.BaseSuccessChance;

    if (definition.Type == ClubActionType.IntimidateReferee && match?.Referee != null)
    {
      chance = ApplyIntimidatePersonalityModifier(chance, match.Referee.PersonalityType);
    }

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

  public decimal ApplyIntimidatePersonalityModifier(
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

  public void ApplySquadEffects(Club club, ClubActionType actionType)
  {
    GameOptions options = Options;

    switch (actionType)
    {
      case ClubActionType.TeamBonding:
        club.Chemistry = ClampStatus(club.Chemistry + options.TeamBondingChemistryBonus);
        club.Discipline = ClampStatus(club.Discipline - options.TeamBondingDisciplinePenalty);
        break;
      case ClubActionType.FinePlayer:
        club.Discipline = ClampStatus(club.Discipline + options.FinePlayerDisciplineBonus);
        club.Morale = ClampStatus(club.Morale - options.FinePlayerMoralePenalty);
        break;
      case ClubActionType.MotivationalTalk:
        club.Morale = ClampStatus(club.Morale + options.MotivationalTalkMoraleBonus);
        break;
      case ClubActionType.BrutalTraining:
        club.Morale = ClampStatus(club.Morale - options.BrutalTrainingMoralePenalty);
        club.Discipline = ClampStatus(club.Discipline + options.BrutalTrainingDisciplineBonus);
        break;
      case ClubActionType.PromiseWinBonus:
        club.Morale = ClampStatus(club.Morale + options.PromiseWinBonusMoraleBonus);
        break;
    }
  }

  public void ApplyLobbyFederation(Club club)
  {
    GameOptions options = Options;

    if (club.President == null)
    {
      throw new BusinessException("Federasyon lobiciliği için başkan bilgisi bulunamadı.");
    }

    if (club.President.ReputationPoints < options.LobbyFederationReputationCost)
    {
      throw new BusinessException("Federasyon lobiciliği için yeterli itibar puanı yok.");
    }

    club.President.ReputationPoints -= options.LobbyFederationReputationCost;
    club.Suspicion = Math.Max(0, club.Suspicion - options.LobbyFederationSuspicionReduction);
  }

  public void ApplyDodgySponsorship(Club club)
  {
    club.Cash += Options.DodgySponsorshipCashGain;
  }

  public void ApplyMediaSpinReputationRepair(Club club)
  {
    if (club.President == null)
    {
      throw new BusinessException("İtibar onarımı için başkan bilgisi bulunamadı.");
    }

    club.President.ReputationPoints += Options.MediaSpinReputationRepair;
  }

  public void ApplyMediaSpinOpponentMorale(Club opponentClub)
  {
    opponentClub.Morale = ClampStatus(
      opponentClub.Morale - Options.MediaSpinOpponentMoralePenalty);
  }

  public void EnsurePresidentCanAffordLobby(Club club)
  {
    if (club.President == null)
    {
      throw new BusinessException("Federasyon lobiciliği için başkan bilgisi bulunamadı.");
    }

    if (club.President.ReputationPoints < Options.LobbyFederationReputationCost)
    {
      throw new BusinessException("Federasyon lobiciliği için yeterli itibar puanı yok.");
    }
  }

  public decimal GetPromiseWinBonusAmount() => Options.PromiseWinBonusAmount;

  public decimal GetTapUpDiscountRatio() => Options.TapUpTransferFeeDiscountRatio;

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

  private static int ClampStatus(int value) => Math.Clamp(value, 0, 100);
}
