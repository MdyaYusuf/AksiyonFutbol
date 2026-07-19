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
  private static readonly JsonSerializerOptions _jsonOptions = new()
  {
    Converters = { new JsonStringEnumConverter() }
  };

  public SimulatedMatchResultDto Simulate(
    Match match,
    MatchDaySquad homeSquad,
    MatchDaySquad awaySquad,
    Referee referee)
  {
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
      Club attackingClub = homeControlsAttack ? homeClub : awayClub;

      double attackSuccessChance = attackingPower.AttackPower / (attackingPower.AttackPower + defendingPower.DefenseStrength);
      double goalChance = attackSuccessChance * BaseGoalRate * GetRefereeGoalModifier(referee);

      if (Random.Shared.NextDouble() <= goalChance)
      {
        PlayerInstance scorer = PickScorer(attackingPlayers);
        scorer.SeasonGoals++;

        if (homeControlsAttack)
        {
          homeScore++;
        }
        else
        {
          awayScore++;
        }

        events.Add(new MatchEventDto
        {
          Minute = minute,
          Type = MatchEventType.Goal,
          ClubId = attackingClub.Id,
          PlayerId = scorer.Id,
          Description = $"{minute}. dakikada {attackingClub.Name} golü buldu. Gol: {scorer.FirstName} {scorer.LastName}."
        });
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
      MatchLogJson = JsonSerializer.Serialize(events.OrderBy(e => e.Minute).ToList(), _jsonOptions)
    };
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

  private sealed record TeamPower
  {
    public double AttackPower { get; init; }
    public double DefenseStrength { get; init; }
    public double MidfieldControl { get; init; }
  }

  private sealed record MentalityModifiers(double Attack, double Defense, double Midfield);
}
