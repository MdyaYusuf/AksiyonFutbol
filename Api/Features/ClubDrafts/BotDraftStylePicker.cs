using Api.Core.Options;

namespace Api.Features.ClubDrafts;

public static class BotDraftStylePicker
{
  public static BotDraftStyle Roll(BotDraftStyleWeights weights)
  {
    (BotDraftStyle Style, decimal Weight)[] entries =
    [
      (BotDraftStyle.Balanced, Math.Max(0m, weights.Balanced)),
      (BotDraftStyle.YouthCheap, Math.Max(0m, weights.YouthCheap)),
      (BotDraftStyle.VeteranWages, Math.Max(0m, weights.VeteranWages)),
      (BotDraftStyle.StarHeavy, Math.Max(0m, weights.StarHeavy)),
      (BotDraftStyle.Depth, Math.Max(0m, weights.Depth))
    ];

    decimal total = 0m;

    foreach ((BotDraftStyle _, decimal weight) in entries)
    {
      total += weight;
    }

    if (total <= 0m)
    {
      return BotDraftStyle.Balanced;
    }

    decimal roll = (decimal)Random.Shared.NextDouble() * total;
    decimal cumulative = 0m;

    foreach ((BotDraftStyle style, decimal weight) in entries)
    {
      cumulative += weight;

      if (roll <= cumulative)
      {
        return style;
      }
    }

    return BotDraftStyle.Balanced;
  }
}
