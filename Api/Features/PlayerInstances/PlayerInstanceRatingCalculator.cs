using Api.Features.BasePlayers;

namespace Api.Features.PlayerInstances;

public static class PlayerInstanceRatingCalculator
{
  public static int Calculate(PlayerInstance player)
  {
    return player.Position switch
    {
      PlayerPosition.Goalkeeper => CalculateWeightedRating(player, 15, 60, 25),
      PlayerPosition.Defender => CalculateWeightedRating(player, 20, 50, 30),
      PlayerPosition.Midfielder => CalculateWeightedRating(player, 25, 25, 50),
      PlayerPosition.Forward => CalculateWeightedRating(player, 50, 20, 30),
      _ => CalculateWeightedRating(player, 34, 33, 33)
    };
  }

  private static int CalculateWeightedRating(
    PlayerInstance player,
    int attackWeight,
    int defenseWeight,
    int midfieldWeight)
  {
    return (
      player.AttackPower * attackWeight +
      player.DefenseStrength * defenseWeight +
      player.MidfieldControl * midfieldWeight) / 100;
  }
}
