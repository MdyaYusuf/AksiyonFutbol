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

  public decimal RoleFeeMultiplierStar { get; set; } = 1.45m;
  public decimal RoleFeeMultiplierKey { get; set; } = 1.25m;
  public decimal RoleFeeMultiplierStarter { get; set; } = 1.20m;
  public decimal RoleFeeMultiplierEngine { get; set; } = 1.05m;
  public decimal RoleFeeMultiplierSupport { get; set; } = 1.00m;
  public decimal RoleFeeMultiplierRotation { get; set; } = 0.75m;
  public decimal RoleFeeMultiplierCheap { get; set; } = 0.50m;
  public decimal RoleFeeMultiplierBackup { get; set; } = 0.55m;

  public decimal RoleWageMultiplierStar { get; set; } = 1.35m;
  public decimal RoleWageMultiplierKey { get; set; } = 1.20m;
  public decimal RoleWageMultiplierStarter { get; set; } = 1.15m;
  public decimal RoleWageMultiplierEngine { get; set; } = 1.05m;
  public decimal RoleWageMultiplierSupport { get; set; } = 1.00m;
  public decimal RoleWageMultiplierRotation { get; set; } = 0.80m;
  public decimal RoleWageMultiplierCheap { get; set; } = 0.55m;
  public decimal RoleWageMultiplierBackup { get; set; } = 0.60m;
}
