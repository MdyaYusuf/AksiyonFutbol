using Api.Core.Options;

namespace Api.Features.Clubs;

public class ClubScandalBusinessRules
{
  public static decimal CalculateDetectionChance(
    GameOptions options,
    decimal baseDetectionChance,
    int currentSuspicion)
  {
    decimal scaled = baseDetectionChance + currentSuspicion * options.SuspicionDetectionScale;

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

  public static int ClampClubStatus(int value) => Math.Clamp(value, 0, 100);
}
