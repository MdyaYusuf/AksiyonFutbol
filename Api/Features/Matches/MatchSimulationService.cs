using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.ClubLineups;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using Api.Features.Referees;
using Microsoft.Extensions.Options;

namespace Api.Features.Matches;

public class MatchSimulationService(IOptions<GameOptions> _gameOptions) : IMatchSimulationService
{
  private const int AttackSlotCount = 72;
  private const double BaseGoalRate = 0.075;
  private const double DeliveryChance = 0.40;
  private const double YellowCardChance = 0.04;
  private const double InjuryChance = 0.015;
  private const double SetPieceChance = 0.18;

  private static readonly JsonSerializerOptions _jsonOptions = new()
  {
    Converters = { new JsonStringEnumConverter() }
  };

  public SimulatedMatchResultDto Simulate(
    Match match,
    MatchDaySquad homeSquad,
    MatchDaySquad awaySquad,
    Referee referee,
    MatchBribeInfluence? bribeInfluence = null)
  {
    MatchBribeInfluence influence = bribeInfluence ?? MatchBribeInfluence.None;
    List<PlayerInstance> homePlayers = homeSquad.StartingPlayers;
    List<PlayerInstance> awayPlayers = awaySquad.StartingPlayers;

    if (homePlayers.Count == 0 || awayPlayers.Count == 0)
    {
      throw new BusinessException("Maç simülasyonu için iki takımda da en az bir uygun oyuncu bulunmalıdır.");
    }

    Club homeClub = match.HomeClub;
    Club awayClub = match.AwayClub;

    TeamPower homePower = CalculateTeamPower(homePlayers, homeClub, homeSquad.Mentality, isHome: true);
    TeamPower awayPower = CalculateTeamPower(awayPlayers, awayClub, awaySquad.Mentality, isHome: false);

    List<MatchEventDto> events = new()
    {
      new MatchEventDto
      {
        Minute = 1,
        Type = MatchEventType.KickOff,
        Description = $"{homeClub.Name} - {awayClub.Name} maçı başladı."
      }
    };

    int homeScore = 0;
    int awayScore = 0;

    for (int slot = 1; slot <= AttackSlotCount; slot++)
    {
      int minute = Math.Min(90, (int)Math.Ceiling(slot * 90d / AttackSlotCount));

      if (minute == 45 && events.All(e => e.Type != MatchEventType.HalfTime))
      {
        events.Add(new MatchEventDto
        {
          Minute = 45,
          Type = MatchEventType.HalfTime,
          Description = $"İlk yarı sonucu: {homeClub.Name} {homeScore} - {awayScore} {awayClub.Name}."
        });
      }

      bool homeControlsAttack = RollWeighted(homePower.MidfieldControl, awayPower.MidfieldControl);

      TeamPower attackingPower = homeControlsAttack ? homePower : awayPower;
      TeamPower defendingPower = homeControlsAttack ? awayPower : homePower;
      List<PlayerInstance> attackingPlayers = homeControlsAttack ? homePlayers : awayPlayers;
      List<PlayerInstance> defendingPlayers = homeControlsAttack ? awayPlayers : homePlayers;
      Club attackingClub = homeControlsAttack ? homeClub : awayClub;

      double attackSuccessChance = attackingPower.AttackPower / (attackingPower.AttackPower + defendingPower.DefenseStrength);
      double goalChance = attackSuccessChance * BaseGoalRate * GetRefereeGoalModifier(referee);
      goalChance *= GetBribeGoalModifier(attackingClub.Id, influence);

      Club defendingClub = homeControlsAttack ? awayClub : homeClub;

      AppendAttackSequence(
        events,
        minute,
        attackingClub,
        defendingClub,
        attackingPlayers,
        defendingPlayers,
        goalChance,
        ref homeScore,
        ref awayScore,
        homeControlsAttack);
    }

    events.Add(new MatchEventDto
    {
      Minute = 90,
      Type = MatchEventType.FullTime,
      Description = $"Maç sonucu: {homeClub.Name} {homeScore} - {awayScore} {awayClub.Name}."
    });

    ApplyClubResultEffects(homeClub, awayClub, homeScore, awayScore);

    return new SimulatedMatchResultDto
    {
      HomeScore = homeScore,
      AwayScore = awayScore,
      MatchLogJson = JsonSerializer.Serialize(events.OrderBy(e => e.Minute).ToList(), _jsonOptions)
    };
  }

  private static void AppendAttackSequence(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers,
    double goalChance,
    ref int homeScore,
    ref int awayScore,
    bool homeControlsAttack)
  {
    PlayerInstance carrier = PickRandomPlayer(attackingPlayers);

    MatchEventType openPlay = Random.Shared.NextDouble() < 0.55
      ? MatchEventType.BuildUp
      : MatchEventType.Possession;

    events.Add(CreateEvent(minute, openPlay, attackingClub, carrier));

    MatchEventType channel = PickAttackChannel();
    PlayerInstance channelPlayer = PickRandomPlayer(attackingPlayers);
    events.Add(CreateEvent(minute, channel, attackingClub, channelPlayer));

    if (Random.Shared.NextDouble() < DeliveryChance)
    {
      MatchEventType delivery = Random.Shared.NextDouble() < 0.55
        ? MatchEventType.Cross
        : MatchEventType.ThroughBall;
      events.Add(CreateEvent(minute, delivery, attackingClub, PickRandomPlayer(attackingPlayers)));
    }

    if (Random.Shared.NextDouble() <= goalChance)
    {
      PlayerInstance scorer = PickScorer(attackingPlayers);
      events.Add(CreateEvent(minute, MatchEventType.Shot, attackingClub, scorer));

      scorer.SeasonGoals++;

      if (homeControlsAttack)
      {
        homeScore++;
      }
      else
      {
        awayScore++;
      }

      events.Add(CreateEvent(minute, MatchEventType.Goal, attackingClub, scorer));
      TryAppendDiscipline(
        events,
        minute,
        attackingClub,
        defendingClub,
        attackingPlayers,
        defendingPlayers);
      return;
    }

    AppendNonGoalOutcome(events, minute, attackingClub, attackingPlayers, defendingPlayers);
    TryAppendDiscipline(
      events,
      minute,
      attackingClub,
      defendingClub,
      attackingPlayers,
      defendingPlayers);
  }

  private static void AppendNonGoalOutcome(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers)
  {
    double roll = Random.Shared.NextDouble();

    if (roll < SetPieceChance)
    {
      MatchEventType setPiece = Random.Shared.NextDouble() < 0.6
        ? MatchEventType.Corner
        : MatchEventType.FreeKick;
      events.Add(CreateEvent(minute, setPiece, attackingClub, PickRandomPlayer(attackingPlayers)));
      return;
    }

    PlayerInstance shooter = PickRandomPlayer(attackingPlayers);
    events.Add(CreateEvent(minute, MatchEventType.Shot, attackingClub, shooter));

    MatchEventType finish = roll switch
    {
      < 0.45 => MatchEventType.Save,
      < 0.70 => MatchEventType.Block,
      _ => MatchEventType.Miss
    };

    PlayerInstance? involved = finish == MatchEventType.Miss
      ? shooter
      : PickRandomPlayer(defendingPlayers);

    events.Add(CreateEvent(minute, finish, attackingClub, involved ?? shooter));
  }

  private static void TryAppendDiscipline(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers)
  {
    double roll = Random.Shared.NextDouble();

    if (roll < InjuryChance)
    {
      bool attackerInjured = Random.Shared.NextDouble() < 0.5;
      Club club = attackerInjured ? attackingClub : defendingClub;
      List<PlayerInstance> pool = attackerInjured ? attackingPlayers : defendingPlayers;
      events.Add(CreateEvent(minute, MatchEventType.Injury, club, PickRandomPlayer(pool)));
      return;
    }

    if (roll < InjuryChance + YellowCardChance)
    {
      bool attackerBooked = Random.Shared.NextDouble() < 0.45;
      Club club = attackerBooked ? attackingClub : defendingClub;
      List<PlayerInstance> pool = attackerBooked ? attackingPlayers : defendingPlayers;
      events.Add(CreateEvent(minute, MatchEventType.YellowCard, club, PickRandomPlayer(pool)));
    }
  }

  private static MatchEventDto CreateEvent(
    int minute,
    MatchEventType type,
    Club club,
    PlayerInstance? player)
  {
    return new MatchEventDto
    {
      Minute = minute,
      Type = type,
      ClubId = club.Id,
      PlayerId = player?.Id,
      Description = MatchSimulationCommentary.Format(type, club, player, minute)
    };
  }

  private static MatchEventType PickAttackChannel()
  {
    double roll = Random.Shared.NextDouble();

    if (roll < 0.33)
    {
      return MatchEventType.AttackLeft;
    }

    if (roll < 0.66)
    {
      return MatchEventType.AttackCenter;
    }

    return MatchEventType.AttackRight;
  }

  private void ApplyClubResultEffects(
    Club homeClub,
    Club awayClub,
    int homeScore,
    int awayScore)
  {
    GameOptions options = _gameOptions.Value;

    if (homeScore > awayScore)
    {
      ApplyClubDeltas(homeClub, options.PostMatchWinMoraleDelta, options.PostMatchWinCashReward);
      ApplyClubDeltas(awayClub, options.PostMatchLossMoraleDelta, options.PostMatchLossCashReward);
      return;
    }

    if (awayScore > homeScore)
    {
      ApplyClubDeltas(awayClub, options.PostMatchWinMoraleDelta, options.PostMatchWinCashReward);
      ApplyClubDeltas(homeClub, options.PostMatchLossMoraleDelta, options.PostMatchLossCashReward);
      return;
    }

    ApplyClubDeltas(homeClub, options.PostMatchDrawMoraleDelta, options.PostMatchDrawCashReward);
    ApplyClubDeltas(awayClub, options.PostMatchDrawMoraleDelta, options.PostMatchDrawCashReward);
  }

  private static void ApplyClubDeltas(Club club, int moraleDelta, decimal cashReward)
  {
    club.Morale = Math.Clamp(club.Morale + moraleDelta, 0, 100);
    club.Cash += cashReward;
  }

  private static TeamPower CalculateTeamPower(
    List<PlayerInstance> players,
    Club club,
    TeamMentality mentality,
    bool isHome)
  {
    double matchDayVariance = Random.Shared.NextDouble() * 0.30 + 0.85;
    double homeAdvantage = isHome ? 1.05 : 1.0;
    double clubStatusModifier = (club.Morale + club.Chemistry + club.Discipline) / 300d;
    double finalModifier = matchDayVariance * homeAdvantage * (0.90 + clubStatusModifier * 0.20);
    MentalityModifiers mentalityModifiers = GetMentalityModifiers(mentality);

    return new TeamPower
    {
      AttackPower = Math.Max(1, players.Average(p => p.AttackPower) * finalModifier * mentalityModifiers.Attack),
      DefenseStrength = Math.Max(1, players.Average(p => p.DefenseStrength) * finalModifier * mentalityModifiers.Defense),
      MidfieldControl = Math.Max(1, players.Average(p => p.MidfieldControl) * finalModifier * mentalityModifiers.Midfield)
    };
  }

  private static MentalityModifiers GetMentalityModifiers(TeamMentality mentality)
  {
    return mentality switch
    {
      TeamMentality.Attacking => new MentalityModifiers(1.08, 0.94, 1.02),
      TeamMentality.Defensive => new MentalityModifiers(0.94, 1.08, 1.02),
      _ => new MentalityModifiers(1.0, 1.0, 1.0)
    };
  }

  private static bool RollWeighted(double firstWeight, double secondWeight)
  {
    double total = firstWeight + secondWeight;
    return Random.Shared.NextDouble() * total <= firstWeight;
  }

  private static double GetRefereeGoalModifier(Referee referee)
  {
    return referee.PersonalityType switch
    {
      RefereePersonalityType.Lenient => 1.04,
      RefereePersonalityType.Strict => 0.96,
      RefereePersonalityType.Showman => 1.02,
      _ => 1.0
    };
  }

  private double GetBribeGoalModifier(Guid attackingClubId, MatchBribeInfluence influence)
  {
    if (!influence.Favors(attackingClubId))
    {
      if (influence.FavoredClubIds.Count == 0)
      {
        return 1.0;
      }

      return (double)_gameOptions.Value.BribeOpponentGoalMultiplier;
    }

    return (double)_gameOptions.Value.BribeFavoredGoalMultiplier;
  }

  private static PlayerInstance PickScorer(List<PlayerInstance> players)
  {
    int totalAttackPower = players.Sum(p => Math.Max(1, p.AttackPower));
    int roll = Random.Shared.Next(1, totalAttackPower + 1);
    int cumulative = 0;

    foreach (PlayerInstance player in players.OrderByDescending(p => p.AttackPower))
    {
      cumulative += Math.Max(1, player.AttackPower);

      if (roll <= cumulative)
      {
        return player;
      }
    }

    return players[0];
  }

  private static PlayerInstance PickRandomPlayer(List<PlayerInstance> players)
  {
    return players[Random.Shared.Next(players.Count)];
  }

  private sealed record TeamPower
  {
    public double AttackPower { get; init; }
    public double DefenseStrength { get; init; }
    public double MidfieldControl { get; init; }
  }

  private sealed record MentalityModifiers(double Attack, double Defense, double Midfield);
}
