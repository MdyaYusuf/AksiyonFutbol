namespace Api.Features.ClubPresidents;

/// <summary>
/// Pure clamp and delta math for president build attributes (1–5).
/// </summary>
public static class ClubPresidentAttributeBusinessRules
{
  public static int ClampAttribute(int value)
  {
    return Math.Clamp(value, ClubPresidentBusinessRules.AttributeMin, ClubPresidentBusinessRules.AttributeMax);
  }

  public static int ApplyAttributeGain(int current, int gain)
  {
    if (gain <= 0)
    {
      return current;
    }

    return ClampAttribute(current + gain);
  }

  public static int ApplyAttributeLoss(int current, int loss)
  {
    if (loss <= 0)
    {
      return current;
    }

    return ClampAttribute(current - loss);
  }

  public static int AppliedGain(int before, int after) => Math.Max(0, after - before);

  public static int AppliedLoss(int before, int after) => Math.Max(0, before - after);
}
