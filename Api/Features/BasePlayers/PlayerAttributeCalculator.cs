using Api.Features.PlayerInstances;

namespace Api.Features.BasePlayers;

public static class PlayerAttributeCalculator
{
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
    if (position == PlayerPosition.Goalkeeper)
    {
      return (
        Average(attributes.Throwing, attributes.Kicking, attributes.Vision),
        Average(
          attributes.Reflexes,
          attributes.OneOnOnes,
          attributes.AerialReach,
          attributes.Positioning),
        Average(attributes.FirstTouch, attributes.Handling, attributes.RushingOut));
    }

    return (
      Average(
        attributes.Pace,
        attributes.Finishing,
        attributes.OffTheBall,
        attributes.Composure),
      Average(
        attributes.Strength,
        attributes.Tackling,
        attributes.Marking,
        attributes.Bravery),
      Average(
        attributes.Passing,
        attributes.Technique,
        attributes.Stamina,
        attributes.Decisions));
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

  private static PlayerAttributeValues ReadAttributes(BasePlayer player)
  {
    return new PlayerAttributeValues(
      Pace: player.Pace,
      Finishing: player.Finishing,
      OffTheBall: player.OffTheBall,
      Composure: player.Composure,
      Passing: player.Passing,
      Technique: player.Technique,
      Stamina: player.Stamina,
      Decisions: player.Decisions,
      Strength: player.Strength,
      Tackling: player.Tackling,
      Marking: player.Marking,
      Bravery: player.Bravery,
      Throwing: player.Throwing,
      Kicking: player.Kicking,
      Vision: player.Vision,
      FirstTouch: player.FirstTouch,
      Handling: player.Handling,
      RushingOut: player.RushingOut,
      Reflexes: player.Reflexes,
      OneOnOnes: player.OneOnOnes,
      AerialReach: player.AerialReach,
      Positioning: player.Positioning);
  }

  private static PlayerAttributeValues ReadAttributes(PlayerInstance player)
  {
    return new PlayerAttributeValues(
      Pace: player.Pace,
      Finishing: player.Finishing,
      OffTheBall: player.OffTheBall,
      Composure: player.Composure,
      Passing: player.Passing,
      Technique: player.Technique,
      Stamina: player.Stamina,
      Decisions: player.Decisions,
      Strength: player.Strength,
      Tackling: player.Tackling,
      Marking: player.Marking,
      Bravery: player.Bravery,
      Throwing: player.Throwing,
      Kicking: player.Kicking,
      Vision: player.Vision,
      FirstTouch: player.FirstTouch,
      Handling: player.Handling,
      RushingOut: player.RushingOut,
      Reflexes: player.Reflexes,
      OneOnOnes: player.OneOnOnes,
      AerialReach: player.AerialReach,
      Positioning: player.Positioning);
  }
}

public readonly record struct PlayerAttributeValues(
  int Pace,
  int Finishing,
  int OffTheBall,
  int Composure,
  int Passing,
  int Technique,
  int Stamina,
  int Decisions,
  int Strength,
  int Tackling,
  int Marking,
  int Bravery,
  int Throwing,
  int Kicking,
  int Vision,
  int FirstTouch,
  int Handling,
  int RushingOut,
  int Reflexes,
  int OneOnOnes,
  int AerialReach,
  int Positioning);
