namespace Api.Features.BasePlayers;

public static class BasePlayerRatingCalculator
{
  public static int Calculate(BasePlayer basePlayer)
  {
    return PlayerAttributeCalculator.CalculateOverallRating(basePlayer);
  }
}
