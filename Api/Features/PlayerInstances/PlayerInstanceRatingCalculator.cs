using Api.Features.BasePlayers;

namespace Api.Features.PlayerInstances;

public static class PlayerInstanceRatingCalculator
{
  public static int Calculate(PlayerInstance player)
  {
    return PlayerAttributeCalculator.CalculateOverallRating(player);
  }
}
