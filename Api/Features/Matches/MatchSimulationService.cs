using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.ClubLineups;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using Api.Features.Referees;
using Microsoft.Extensions.Options;

namespace Api.Features.Matches;

public class MatchSimulationService(IOptions<GameOptions> _gameOptions) : IMatchSimulationService
{
  /// <summary>Chance a given minute becomes a real attack attempt.</summary>
  private const double AttackMinuteChance = 0.48;

  /// <summary>Chance a quiet/contested minute still gets soft possession flavor.</summary>
  private const double QuietPossessionChance = 0.42;

  /// <summary>Chance a non-attack minute is a midfield battle instead of pure idle.</summary>
  private const double ContestedMinuteChance = 0.38;

  private const double ProgressPastMidfieldChance = 0.68;
  private const double ProgressToFinalThirdChance = 0.65;
  private const double DeliveryChance = 0.42;
  private const double DeliverySuccessChance = 0.58;
  private const double CreateShotChance = 0.68;
  private const double YellowCardChance = 0.035;
  private const double InjuryChance = 0.012;
  private const double FoulInsteadOfTackleChance = 0.22;
  private const double BigChanceXgThreshold = 0.18;

  private static readonly JsonSerializerOptions _jsonOptions = new()
  {
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    Converters = { new JsonStringEnumConverter() },
  };

  public SimulatedMatchResultDto Simulate(
    Match match,
    MatchDaySquad homeSquad,
    MatchDaySquad awaySquad,
    Referee referee,
    MatchInfluence? matchInfluence = null)
  {
    MatchInfluence influence = matchInfluence ?? MatchInfluence.None;
    List<PlayerInstance> homePlayers = homeSquad.StartingPlayers;
    List<PlayerInstance> awayPlayers = awaySquad.StartingPlayers;

    if (homePlayers.Count == 0 || awayPlayers.Count == 0)
    {
      throw new BusinessException("Maç simülasyonu için iki takımda da en az bir uygun oyuncu bulunmalıdır.");
    }

    Club homeClub = match.HomeClub;
    Club awayClub = match.AwayClub;

    TeamPower homePower = CalculateTeamPower(
      homePlayers,
      homeClub,
      homeSquad.Mentality,
      isHome: true,
      influence: influence,
      opponentClubId: awayClub.Id);
    TeamPower awayPower = CalculateTeamPower(
      awayPlayers,
      awayClub,
      awaySquad.Mentality,
      isHome: false,
      influence: influence,
      opponentClubId: homeClub.Id);

    List<MatchEventDto> events =
    [
      new MatchEventDto
      {
        Minute = 1,
        Type = MatchEventType.KickOff,
        Description = $"{homeClub.Name} - {awayClub.Name} maçı başladı."
      }
    ];

    int homeScore = 0;
    int awayScore = 0;

    for (int minute = 2; minute <= 89; minute++)
    {
      if (minute == 45)
      {
        events.Add(new MatchEventDto
        {
          Minute = 45,
          Type = MatchEventType.HalfTime,
          Description = $"İlk yarı sonucu: {homeClub.Name} {homeScore} - {awayScore} {awayClub.Name}."
        });
        continue;
      }

      bool homeControls = RollWeighted(homePower.MidfieldControl, awayPower.MidfieldControl);
      TeamPower attackingPower = homeControls ? homePower : awayPower;
      TeamPower defendingPower = homeControls ? awayPower : homePower;
      List<PlayerInstance> attackingPlayers = homeControls ? homePlayers : awayPlayers;
      List<PlayerInstance> defendingPlayers = homeControls ? awayPlayers : homePlayers;
      Club attackingClub = homeControls ? homeClub : awayClub;
      Club defendingClub = homeControls ? awayClub : homeClub;

      double attackBias = attackingPower.AttackPower
        / (attackingPower.AttackPower + defendingPower.DefenseStrength);
      double minuteAttackChance = AttackMinuteChance * (0.85 + attackBias * 0.30);

      if (Random.Shared.NextDouble() < minuteAttackChance)
      {
        AppendAttackFunnel(
          events,
          minute,
          attackingClub,
          defendingClub,
          attackingPlayers,
          defendingPlayers,
          attackingPower,
          defendingPower,
          referee,
          influence,
          ref homeScore,
          ref awayScore,
          homeControls);
        continue;
      }

      if (Random.Shared.NextDouble() < ContestedMinuteChance)
      {
        AppendContestedMinute(
          events,
          minute,
          attackingClub,
          defendingClub,
          attackingPlayers,
          defendingPlayers);
        continue;
      }

      if (Random.Shared.NextDouble() < QuietPossessionChance)
      {
        events.Add(CreateEvent(
          minute,
          Random.Shared.NextDouble() < 0.55 ? MatchEventType.Possession : MatchEventType.BuildUp,
          attackingClub,
          PickRandomPlayer(attackingPlayers)));
      }
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
      MatchLogJson = JsonSerializer.Serialize(
        events
          .Select((matchEvent, index) => (Event: matchEvent, Index: index))
          .OrderBy(entry => entry.Event.Minute)
          .ThenBy(entry => entry.Index)
          .Select(entry => entry.Event)
          .ToList(),
        _jsonOptions)
    };
  }

  private void AppendAttackFunnel(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers,
    TeamPower attackingPower,
    TeamPower defendingPower,
    Referee referee,
    MatchInfluence influence,
    ref int homeScore,
    ref int awayScore,
    bool homeControlsAttack)
  {
    int attackStartIndex = events.Count;

    void CollapseFailedAttack(Action appendOutcome)
    {
      if (events.Count > attackStartIndex)
      {
        events.RemoveRange(attackStartIndex, events.Count - attackStartIndex);
      }

      appendOutcome();
    }

    events.Add(CreateEvent(
      minute,
      Random.Shared.NextDouble() < 0.55 ? MatchEventType.BuildUp : MatchEventType.Possession,
      attackingClub,
      PickRandomPlayer(attackingPlayers)));

    double progressBias = attackingPower.MidfieldControl
      / (attackingPower.MidfieldControl + defendingPower.MidfieldControl);

    if (Random.Shared.NextDouble() > ProgressPastMidfieldChance * (0.75 + progressBias * 0.5))
    {
      CollapseFailedAttack(() =>
      {
        AppendDefensiveStop(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers, early: true);
        TryAppendDiscipline(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      });
      return;
    }

    events.Add(CreateEvent(minute, PickAttackChannel(), attackingClub, PickRandomPlayer(attackingPlayers)));

    double finalThirdBias = attackingPower.AttackPower
      / (attackingPower.AttackPower + defendingPower.DefenseStrength);

    if (Random.Shared.NextDouble() > ProgressToFinalThirdChance * (0.70 + finalThirdBias * 0.6))
    {
      CollapseFailedAttack(() =>
      {
        AppendDefensiveStop(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers, early: false);
        TryAppendDiscipline(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      });
      return;
    }

    if (Random.Shared.NextDouble() < DeliveryChance)
    {
      MatchEventType delivery = Random.Shared.NextDouble() < 0.55
        ? MatchEventType.Cross
        : MatchEventType.ThroughBall;
      events.Add(CreateEvent(minute, delivery, attackingClub, PickRandomPlayer(attackingPlayers)));

      if (Random.Shared.NextDouble() > DeliverySuccessChance * (0.75 + finalThirdBias * 0.5))
      {
        CollapseFailedAttack(() =>
        {
          AppendBrokenDelivery(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
          TryAppendDiscipline(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
        });
        return;
      }
    }
    else
    {
      // Ensure a clear final approach beat before the shot so live commentary can breathe.
      events.Add(CreateEvent(
        minute,
        Random.Shared.NextDouble() < 0.5 ? MatchEventType.ThroughBall : MatchEventType.AttackCenter,
        attackingClub,
        PickRandomPlayer(attackingPlayers)));
    }

    if (Random.Shared.NextDouble() > CreateShotChance * (0.70 + finalThirdBias * 0.6))
    {
      CollapseFailedAttack(() =>
      {
        AppendChanceWasted(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
        TryAppendDiscipline(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      });
      return;
    }

    // Real chance: keep the multi-line build-up through the shot.
    AppendShotSequence(
      events,
      minute,
      attackingClub,
      defendingClub,
      attackingPlayers,
      defendingPlayers,
      finalThirdBias,
      referee,
      influence,
      ref homeScore,
      ref awayScore,
      homeControlsAttack);

    TryAppendDiscipline(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
  }

  private void AppendShotSequence(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers,
    double chanceQuality,
    Referee referee,
    MatchInfluence influence,
    ref int homeScore,
    ref int awayScore,
    bool homeControlsAttack)
  {
    PlayerInstance shooter = PickScorer(attackingPlayers);

    double goalChance = Math.Clamp(
      (0.10 + chanceQuality * 0.36)
        * GetRefereeGoalModifier(referee)
        * GetInfluenceGoalModifier(attackingClub.Id, defendingClub.Id, influence),
      0.06,
      0.62);

    bool isBigChance = goalChance >= BigChanceXgThreshold;

    events.Add(CreateEvent(
      minute,
      MatchEventType.Shot,
      attackingClub,
      shooter,
      expectedGoals: goalChance,
      isBigChance: isBigChance));

    if (Random.Shared.NextDouble() <= goalChance)
    {
      shooter.SeasonGoals++;

      if (homeControlsAttack)
      {
        homeScore++;
      }
      else
      {
        awayScore++;
      }

      events.Add(CreateEvent(minute, MatchEventType.Goal, attackingClub, shooter));
      return;
    }

    double finishRoll = Random.Shared.NextDouble();

    if (finishRoll < 0.34)
    {
      events.Add(CreateEvent(minute, MatchEventType.Save, defendingClub, PickGoalkeeperOrDefender(defendingPlayers)));
      return;
    }

    if (finishRoll < 0.58)
    {
      events.Add(CreateEvent(minute, MatchEventType.Block, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (finishRoll < 0.72)
    {
      events.Add(CreateEvent(minute, MatchEventType.Corner, attackingClub, PickRandomPlayer(attackingPlayers)));
      return;
    }

    if (finishRoll < 0.88)
    {
      events.Add(CreateEvent(minute, MatchEventType.Miss, attackingClub, shooter));
      return;
    }

    events.Add(CreateEvent(
      minute,
      MatchEventType.GoalKick,
      defendingClub,
      PickGoalkeeperOrDefender(defendingPlayers),
      descriptionOverride: MatchSimulationCommentary.FormatGoalKick(defendingClub, shooter)));
  }

  private static void AppendContestedMinute(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers)
  {
    double roll = Random.Shared.NextDouble();

    if (roll < 0.34)
    {
      events.Add(CreateEvent(minute, MatchEventType.Tackle, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.58)
    {
      events.Add(CreateEvent(minute, MatchEventType.Interception, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.74)
    {
      Club looseClub = Random.Shared.NextDouble() < 0.5 ? attackingClub : defendingClub;
      List<PlayerInstance> loosePool = looseClub.Id == attackingClub.Id ? attackingPlayers : defendingPlayers;
      events.Add(CreateEvent(minute, MatchEventType.LooseBall, looseClub, PickRandomPlayer(loosePool)));
      return;
    }

    if (roll < 0.88)
    {
      AppendThrowIn(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      return;
    }

    AppendFoulFreeKick(events, minute, defendingClub, attackingClub, defendingPlayers, attackingPlayers);
  }

  private static void AppendDefensiveStop(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers,
    bool early)
  {
    double roll = Random.Shared.NextDouble();

    if (roll < FoulInsteadOfTackleChance)
    {
      AppendFoulFreeKick(events, minute, defendingClub, attackingClub, defendingPlayers, attackingPlayers);
      return;
    }

    if (early)
    {
      if (roll < 0.42)
      {
        events.Add(CreateEvent(minute, MatchEventType.Tackle, defendingClub, PickRandomPlayer(defendingPlayers)));
        return;
      }

      if (roll < 0.72)
      {
        events.Add(CreateEvent(minute, MatchEventType.Interception, defendingClub, PickRandomPlayer(defendingPlayers)));
        return;
      }

      AppendThrowIn(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      return;
    }

    if (roll < 0.38)
    {
      events.Add(CreateEvent(minute, MatchEventType.Tackle, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.62)
    {
      events.Add(CreateEvent(minute, MatchEventType.Clearance, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.80)
    {
      events.Add(CreateEvent(minute, MatchEventType.LooseBall, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    AppendThrowIn(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
  }

  private static void AppendBrokenDelivery(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers)
  {
    double roll = Random.Shared.NextDouble();

    if (roll < 0.34)
    {
      events.Add(CreateEvent(minute, MatchEventType.Interception, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.58)
    {
      events.Add(CreateEvent(minute, MatchEventType.Clearance, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.72)
    {
      events.Add(CreateEvent(minute, MatchEventType.LooseBall, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.88)
    {
      AppendThrowIn(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      return;
    }

    events.Add(CreateEvent(minute, MatchEventType.Corner, attackingClub, PickRandomPlayer(attackingPlayers)));
  }

  private static void AppendChanceWasted(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers)
  {
    double roll = Random.Shared.NextDouble();

    if (roll < 0.30)
    {
      events.Add(CreateEvent(minute, MatchEventType.Clearance, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.48)
    {
      events.Add(CreateEvent(minute, MatchEventType.Tackle, defendingClub, PickRandomPlayer(defendingPlayers)));
      return;
    }

    if (roll < 0.64)
    {
      events.Add(CreateEvent(minute, MatchEventType.LooseBall, attackingClub, PickRandomPlayer(attackingPlayers)));
      return;
    }

    if (roll < 0.82)
    {
      AppendThrowIn(events, minute, attackingClub, defendingClub, attackingPlayers, defendingPlayers);
      return;
    }

    events.Add(CreateEvent(minute, MatchEventType.Corner, attackingClub, PickRandomPlayer(attackingPlayers)));
  }

  /// <summary>
  /// Attacking side misplaces the ball into touch; defending side takes the throw-in.
  /// Stored as one event so live feed does not pause on mundane restarts.
  /// </summary>
  private static void AppendThrowIn(
    List<MatchEventDto> events,
    int minute,
    Club attackingClub,
    Club defendingClub,
    List<PlayerInstance> attackingPlayers,
    List<PlayerInstance> defendingPlayers)
  {
    PlayerInstance? outPlayer = PickRandomPlayer(attackingPlayers);
    PlayerInstance? throwPlayer = PickRandomPlayer(defendingPlayers);

    events.Add(CreateEvent(
      minute,
      MatchEventType.ThrowIn,
      defendingClub,
      throwPlayer,
      descriptionOverride: MatchSimulationCommentary.FormatThrowInRestart(
        attackingClub,
        outPlayer,
        defendingClub,
        throwPlayer)));
  }

  /// <summary>
  /// Foul plus free-kick restart as a single commentary beat.
  /// </summary>
  private static void AppendFoulFreeKick(
    List<MatchEventDto> events,
    int minute,
    Club foulingClub,
    Club freeKickClub,
    List<PlayerInstance> foulingPlayers,
    List<PlayerInstance> freeKickPlayers)
  {
    PlayerInstance? foulPlayer = PickRandomPlayer(foulingPlayers);
    PlayerInstance? freeKickPlayer = PickRandomPlayer(freeKickPlayers);

    events.Add(CreateEvent(
      minute,
      MatchEventType.FreeKick,
      freeKickClub,
      freeKickPlayer,
      descriptionOverride: MatchSimulationCommentary.FormatFoulFreeKick(
        foulingClub,
        foulPlayer,
        freeKickClub,
        freeKickPlayer)));
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
      bool attackerBooked = Random.Shared.NextDouble() < 0.40;
      Club club = attackerBooked ? attackingClub : defendingClub;
      List<PlayerInstance> pool = attackerBooked ? attackingPlayers : defendingPlayers;
      events.Add(CreateEvent(minute, MatchEventType.YellowCard, club, PickRandomPlayer(pool)));
    }
  }

  private static MatchEventDto CreateEvent(
    int minute,
    MatchEventType type,
    Club club,
    PlayerInstance? player,
    double? expectedGoals = null,
    bool? isBigChance = null,
    string? descriptionOverride = null)
  {
    return new MatchEventDto
    {
      Minute = minute,
      Type = type,
      ClubId = club.Id,
      PlayerId = player?.Id,
      Description = descriptionOverride
        ?? MatchSimulationCommentary.Format(
          type,
          club,
          player,
          minute,
          isBigChance: isBigChance == true),
      ExpectedGoals = expectedGoals,
      IsBigChance = isBigChance
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

  private void ApplyClubDeltas(Club club, int moraleDelta, decimal cashReward)
  {
    club.Morale = Math.Clamp(club.Morale + moraleDelta, 0, 100);
    club.Cash += cashReward;
    club.Suspicion = Math.Max(
      0,
      club.Suspicion - _gameOptions.Value.SuspicionDecayPerMatch);
  }

  private TeamPower CalculateTeamPower(
    List<PlayerInstance> players,
    Club club,
    TeamMentality mentality,
    bool isHome,
    MatchInfluence influence,
    Guid opponentClubId)
  {
    double matchDayVariance = Random.Shared.NextDouble() * 0.30 + 0.85;
    double homeAdvantage = isHome ? 1.05 : 1.0;
    double clubStatusModifier = (club.Morale + club.Chemistry + club.Discipline) / 300d;
    double finalModifier = matchDayVariance * homeAdvantage * (0.90 + clubStatusModifier * 0.20);
    MentalityModifiers mentalityModifiers = GetMentalityModifiers(mentality);

    double dopingModifier = influence.HasDoping(club.Id)
      ? (double)_gameOptions.Value.DopingPowerMultiplier
      : 1.0;
    double espionageModifier = influence.HasEspionage(club.Id)
      ? (double)_gameOptions.Value.EspionageEdgeMultiplier
      : 1.0;

    // Sabotage targets the away side: if the opponent successfully sabotaged and
    // this club is away, apply the travel/rest penalty.
    if (!isHome && influence.HasSabotage(opponentClubId))
    {
      finalModifier *= (double)_gameOptions.Value.SabotageAwayPowerMultiplier;
    }

    return new TeamPower
    {
      AttackPower = Math.Max(
        1,
        players.Average(p => p.AttackPower)
          * finalModifier
          * mentalityModifiers.Attack
          * dopingModifier
          * espionageModifier),
      DefenseStrength = Math.Max(
        1,
        players.Average(p => p.DefenseStrength)
          * finalModifier
          * mentalityModifiers.Defense
          * dopingModifier),
      MidfieldControl = Math.Max(
        1,
        players.Average(p => p.MidfieldControl)
          * finalModifier
          * mentalityModifiers.Midfield
          * dopingModifier
          * espionageModifier)
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

  private double GetInfluenceGoalModifier(
    Guid attackingClubId,
    Guid defendingClubId,
    MatchInfluence influence)
  {
    double modifier = 1.0;

    if (influence.Favors(attackingClubId))
    {
      modifier *= (double)_gameOptions.Value.BribeFavoredGoalMultiplier;
    }
    else if (influence.FavoredClubIds.Count > 0)
    {
      // Someone else is favored: this attack is slightly harder.
      modifier *= (double)_gameOptions.Value.BribeOpponentGoalMultiplier;
    }

    // Match-fixing makes the opponent underperform when they attack.
    if (influence.HasMatchFixing(defendingClubId))
    {
      modifier *= (double)_gameOptions.Value.MatchFixingOpponentGoalMultiplier;
    }

    return modifier;
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

  private static PlayerInstance PickGoalkeeperOrDefender(List<PlayerInstance> players)
  {
    PlayerInstance? goalkeeper = players.FirstOrDefault(p => p.Position == PlayerPosition.Goalkeeper);

    if (goalkeeper != null)
    {
      return goalkeeper;
    }

    return PickRandomPlayer(players);
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
