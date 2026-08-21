namespace Api.Core.Options;

/// <summary>
/// Per-profile spend and mix knobs for bot clone-draft.
/// </summary>
public class BotDraftProfileSettings
{
  public decimal TargetCashSpendRatio { get; set; } = 0.85m;
  public decimal TargetWageSpendRatio { get; set; } = 0.85m;
  public int MaxGold { get; set; } = 2;
  public int MinSilver { get; set; } = 0;
  public int MaxIron { get; set; } = 16;
  public decimal FeeBandMultiplier { get; set; } = 1.0m;
  public bool AllowDraftOnly { get; set; }
}
