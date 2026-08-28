namespace Api.Features.ClubPresidents;

/// <summary>
/// Pure lookups and clamp math for president Legitimacy (ReputationPoints) and Infamy.
/// </summary>
public class ClubPresidentMoralityBusinessRules
{
  public const int MaxLegitimacy = 100;
  public const int MaxInfamy = 100;
  public const int HonorablePowerLegitimacyThreshold = 40;
  public const int ShadyTierIIInfamyThreshold = 40;

  public static int ClampLegitimacy(int value) => Math.Clamp(value, 0, MaxLegitimacy);

  public static int ClampInfamy(int value) => Math.Clamp(value, 0, MaxInfamy);

  public static bool HasHonorablePowerUnlock(int legitimacy)
  {
    return legitimacy >= HonorablePowerLegitimacyThreshold;
  }

  public static bool HasShadyTierIIUnlock(int infamy)
  {
    return infamy >= ShadyTierIIInfamyThreshold;
  }

  public static int CalculateLegitimacyAfterGain(int current, int gain)
  {
    return ClampLegitimacy(current + Math.Max(0, gain));
  }

  public static int CalculateLegitimacyAfterLoss(int current, int loss)
  {
    return ClampLegitimacy(current - Math.Max(0, loss));
  }

  public static int CalculateInfamyAfterGain(int current, int gain)
  {
    return ClampInfamy(current + Math.Max(0, gain));
  }

  public static int AppliedLegitimacyGain(int before, int after) => Math.Max(0, after - before);

  public static int AppliedLegitimacyLoss(int before, int after) => Math.Max(0, before - after);

  public static int AppliedInfamyGain(int before, int after) => Math.Max(0, after - before);
}
