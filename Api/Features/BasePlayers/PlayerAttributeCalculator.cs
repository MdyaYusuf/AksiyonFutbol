using Api.Features.PlayerInstances;

namespace Api.Features.BasePlayers;

public static class PlayerAttributeCalculator
{
  private const double PositionalWeight = 0.55;
  private const double PhysicalWeight = 0.25;
  private const double MentalWeight = 0.20;

  public static void ApplyMainStats(BasePlayer player)
  {
    (int attackPower, int defenseStrength, int midfieldControl) = ComputeMainStats(
      player.Position,
      player);

    player.AttackPower = attackPower;
    player.DefenseStrength = defenseStrength;
    player.MidfieldControl = midfieldControl;
  }

  public static void ApplyMainStats(PlayerInstance player)
  {
    (int attackPower, int defenseStrength, int midfieldControl) = ComputeMainStats(
      player.Position,
      player);

    player.AttackPower = attackPower;
    player.DefenseStrength = defenseStrength;
    player.MidfieldControl = midfieldControl;
  }

  public static (int AttackPower, int DefenseStrength, int MidfieldControl) ComputeMainStats(
    PlayerPosition position,
    BasePlayer player)
  {
    return ComputeMainStats(position, ReadAttributes(player));
  }

  public static (int AttackPower, int DefenseStrength, int MidfieldControl) ComputeMainStats(
    PlayerPosition position,
    PlayerInstance player)
  {
    return ComputeMainStats(position, ReadAttributes(player));
  }

  public static (int AttackPower, int DefenseStrength, int MidfieldControl) ComputeMainStats(
    PlayerPosition position,
    PlayerAttributeValues attributes)
  {
    int physical = PhysicalAverage(attributes);
    int mental = MentalAverage(attributes);

    if (position == PlayerPosition.Goalkeeper)
    {
      return (
        0,
        Blend(GoalkeepingAverage(attributes), physical, mental),
        0);
    }

    return (
      Blend(AttackAverage(attributes), physical, mental),
      Blend(DefenseAverage(attributes), physical, mental),
      Blend(MidfieldAverage(attributes), physical, mental));
  }

  public static int CalculateOverallRating(BasePlayer player)
  {
    return CalculateOverallRating(player.Position, ReadAttributes(player));
  }

  public static int CalculateOverallRating(PlayerInstance player)
  {
    return CalculateOverallRating(player.Position, ReadAttributes(player));
  }

  public static int CalculateOverallRating(
    PlayerPosition position,
    PlayerAttributeValues attributes)
  {
    int positional = position switch
    {
      PlayerPosition.Goalkeeper => GoalkeepingAverage(attributes),
      PlayerPosition.Defender => DefenseAverage(attributes),
      PlayerPosition.Midfielder => MidfieldAverage(attributes),
      PlayerPosition.Forward => AttackAverage(attributes),
      _ => AttackAverage(attributes)
    };

    return Average(
      PhysicalAverage(attributes),
      MentalAverage(attributes),
      positional);
  }

  public static int Blend(int positional, int physical, int mental)
  {
    double blended =
      (positional * PositionalWeight) +
      (physical * PhysicalWeight) +
      (mental * MentalWeight);

    int rounded = (int)Math.Round(blended, MidpointRounding.AwayFromZero);
    return ClampStat(rounded);
  }

  public static int Average(params int[] values)
  {
    if (values.Length == 0)
    {
      return 1;
    }

    int sum = 0;

    foreach (int value in values)
    {
      sum += value;
    }

    int average = (int)Math.Round(sum / (double)values.Length, MidpointRounding.AwayFromZero);

    return ClampStat(average);
  }

  public static int ClampStat(int value)
  {
    if (value < 1)
    {
      return 1;
    }

    if (value > 100)
    {
      return 100;
    }

    return value;
  }

  public static PlayerAttributeValues ReadAttributes(BasePlayer player)
  {
    return new PlayerAttributeValues(
      Pace: player.Pace,
      Stamina: player.Stamina,
      Strength: player.Strength,
      Balance: player.Balance,
      Jumping: player.Jumping,
      Decisions: player.Decisions,
      Positioning: player.Positioning,
      Teamwork: player.Teamwork,
      WorkRate: player.WorkRate,
      Leadership: player.Leadership,
      Finishing: player.Finishing,
      OffTheBall: player.OffTheBall,
      Crossing: player.Crossing,
      LongShots: player.LongShots,
      Composure: player.Composure,
      Passing: player.Passing,
      Technique: player.Technique,
      FirstTouch: player.FirstTouch,
      Dribbling: player.Dribbling,
      Vision: player.Vision,
      Tackling: player.Tackling,
      Marking: player.Marking,
      Heading: player.Heading,
      Bravery: player.Bravery,
      Concentration: player.Concentration,
      Reflexes: player.Reflexes,
      OneOnOnes: player.OneOnOnes,
      Handling: player.Handling,
      RushingOut: player.RushingOut,
      Distribution: player.Distribution);
  }

  public static PlayerAttributeValues ReadAttributes(PlayerInstance player)
  {
    return new PlayerAttributeValues(
      Pace: player.Pace,
      Stamina: player.Stamina,
      Strength: player.Strength,
      Balance: player.Balance,
      Jumping: player.Jumping,
      Decisions: player.Decisions,
      Positioning: player.Positioning,
      Teamwork: player.Teamwork,
      WorkRate: player.WorkRate,
      Leadership: player.Leadership,
      Finishing: player.Finishing,
      OffTheBall: player.OffTheBall,
      Crossing: player.Crossing,
      LongShots: player.LongShots,
      Composure: player.Composure,
      Passing: player.Passing,
      Technique: player.Technique,
      FirstTouch: player.FirstTouch,
      Dribbling: player.Dribbling,
      Vision: player.Vision,
      Tackling: player.Tackling,
      Marking: player.Marking,
      Heading: player.Heading,
      Bravery: player.Bravery,
      Concentration: player.Concentration,
      Reflexes: player.Reflexes,
      OneOnOnes: player.OneOnOnes,
      Handling: player.Handling,
      RushingOut: player.RushingOut,
      Distribution: player.Distribution);
  }

  public static int PhysicalAverage(PlayerAttributeValues attributes)
  {
    return Average(
      attributes.Pace,
      attributes.Stamina,
      attributes.Strength,
      attributes.Balance,
      attributes.Jumping);
  }

  public static int MentalAverage(PlayerAttributeValues attributes)
  {
    return Average(
      attributes.Decisions,
      attributes.Positioning,
      attributes.Teamwork,
      attributes.WorkRate,
      attributes.Leadership);
  }

  public static int AttackAverage(PlayerAttributeValues attributes)
  {
    return Average(
      attributes.Finishing,
      attributes.OffTheBall,
      attributes.Crossing,
      attributes.LongShots,
      attributes.Composure);
  }

  public static int MidfieldAverage(PlayerAttributeValues attributes)
  {
    return Average(
      attributes.Passing,
      attributes.Technique,
      attributes.FirstTouch,
      attributes.Dribbling,
      attributes.Vision);
  }

  public static int DefenseAverage(PlayerAttributeValues attributes)
  {
    return Average(
      attributes.Tackling,
      attributes.Marking,
      attributes.Heading,
      attributes.Bravery,
      attributes.Concentration);
  }

  public static int GoalkeepingAverage(PlayerAttributeValues attributes)
  {
    return Average(
      attributes.Reflexes,
      attributes.OneOnOnes,
      attributes.Handling,
      attributes.RushingOut,
      attributes.Distribution);
  }
}

public readonly record struct PlayerAttributeValues(
  int Pace,
  int Stamina,
  int Strength,
  int Balance,
  int Jumping,
  int Decisions,
  int Positioning,
  int Teamwork,
  int WorkRate,
  int Leadership,
  int Finishing,
  int OffTheBall,
  int Crossing,
  int LongShots,
  int Composure,
  int Passing,
  int Technique,
  int FirstTouch,
  int Dribbling,
  int Vision,
  int Tackling,
  int Marking,
  int Heading,
  int Bravery,
  int Concentration,
  int Reflexes,
  int OneOnOnes,
  int Handling,
  int RushingOut,
  int Distribution);
