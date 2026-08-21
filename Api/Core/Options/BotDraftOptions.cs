namespace Api.Core.Options;

/// <summary>
/// Tunables for bot clone-draft spending. Profile-specific tables land in later steps.
/// </summary>
public class BotDraftOptions
{
  /// <summary>Fraction of starting cash the bot aims to spend across the full squad.</summary>
  public decimal TargetCashSpendRatio { get; set; } = 0.85m;

  /// <summary>Fraction of starting wage budget the bot aims to commit.</summary>
  public decimal TargetWageSpendRatio { get; set; } = 0.85m;

  /// <summary>How many near-target candidates to randomize among.</summary>
  public int ShortlistSize { get; set; } = 6;

  /// <summary>Initial ± fraction around fee/wage targets (0.4 = ±40%).</summary>
  public decimal FeeTargetSlack { get; set; } = 0.40m;
}
