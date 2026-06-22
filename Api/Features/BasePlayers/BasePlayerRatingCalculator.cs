namespace Api.Features.BasePlayers;

public static class BasePlayerRatingCalculator
{
  public static int Calculate(BasePlayer basePlayer)
  {
    return basePlayer.Position switch
    {
      PlayerPosition.Goalkeeper => CalculateWeightedRating(basePlayer, 15, 60, 25),
      PlayerPosition.Defender => CalculateWeightedRating(basePlayer, 20, 50, 30),
      PlayerPosition.Midfielder => CalculateWeightedRating(basePlayer, 25, 25, 50),
      PlayerPosition.Forward => CalculateWeightedRating(basePlayer, 50, 20, 30),
      _ => CalculateWeightedRating(basePlayer, 34, 33, 33)
    };
  }

  private static int CalculateWeightedRating(
    BasePlayer basePlayer,
    int attackWeight,
    int defenseWeight,
    int midfieldWeight)
  {
    return (
      basePlayer.AttackPower * attackWeight +
      basePlayer.DefenseStrength * defenseWeight +
      basePlayer.MidfieldControl * midfieldWeight) / 100;
  }
}
