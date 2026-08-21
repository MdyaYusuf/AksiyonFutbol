namespace Api.Core.Options;

/// <summary>
/// Tunables for bot clone-draft spending and strength profiles.
/// </summary>
public class BotDraftOptions
{
  /// <summary>Fallback spend ratio when a profile is missing knobs; profiles override in SelectSquad.</summary>
  public decimal TargetCashSpendRatio { get; set; } = 0.85m;

  /// <summary>Fallback wage spend ratio; profiles override in SelectSquad.</summary>
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

  public BotDraftProfileSettings TutorialWeak { get; set; } = new()
  {
    TargetCashSpendRatio = 0.70m,
    TargetWageSpendRatio = 0.70m,
    MaxGold = 0,
    MinSilver = 0,
    MaxIron = 12,
    FeeBandMultiplier = 0.75m,
    AllowDraftOnly = false
  };

  public BotDraftProfileSettings TutorialMid { get; set; } = new()
  {
    TargetCashSpendRatio = 0.85m,
    TargetWageSpendRatio = 0.85m,
    MaxGold = 1,
    MinSilver = 2,
    MaxIron = 8,
    FeeBandMultiplier = 1.00m,
    AllowDraftOnly = false
  };

  public BotDraftProfileSettings TutorialStrong { get; set; } = new()
  {
    TargetCashSpendRatio = 0.92m,
    TargetWageSpendRatio = 0.92m,
    MaxGold = 2,
    MinSilver = 3,
    MaxIron = 6,
    FeeBandMultiplier = 1.10m,
    AllowDraftOnly = false
  };

  public BotDraftProfileSettings Iron { get; set; } = new()
  {
    TargetCashSpendRatio = 0.65m,
    TargetWageSpendRatio = 0.70m,
    MaxGold = 0,
    MinSilver = 0,
    MaxIron = 14,
    FeeBandMultiplier = 0.70m,
    AllowDraftOnly = false
  };

  public BotDraftProfileSettings Bronze { get; set; } = new()
  {
    TargetCashSpendRatio = 0.75m,
    TargetWageSpendRatio = 0.80m,
    MaxGold = 0,
    MinSilver = 1,
    MaxIron = 10,
    FeeBandMultiplier = 0.85m,
    AllowDraftOnly = false
  };

  public BotDraftProfileSettings Silver { get; set; } = new()
  {
    TargetCashSpendRatio = 0.85m,
    TargetWageSpendRatio = 0.90m,
    MaxGold = 1,
    MinSilver = 3,
    MaxIron = 6,
    FeeBandMultiplier = 1.05m,
    AllowDraftOnly = false
  };

  public BotDraftProfileSettings Gold { get; set; } = new()
  {
    TargetCashSpendRatio = 0.95m,
    TargetWageSpendRatio = 0.95m,
    MaxGold = 4,
    MinSilver = 4,
    MaxIron = 4,
    FeeBandMultiplier = 1.20m,
    AllowDraftOnly = true
  };
}
