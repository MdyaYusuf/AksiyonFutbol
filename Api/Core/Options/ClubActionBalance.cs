namespace Api.Core.Options;

// Tunable balancing numbers for a single action. Kept in Core.Options (as a
// plain numbers holder) so GameOptions can centralize action balances without
// referencing the Actions feature. Config overrides live under
// GameOptions:ClubActionBalances:<ActionName>; code defaults are owned by the
// Actions feature and merged in at runtime by ClubActionProvider.
public sealed class ClubActionBalance
{
  // Cash removed from the club when the action is performed.
  public decimal Cost { get; set; }

  // Suspicion ("Heat") added on execution. Only meaningful for shady actions.
  public int HeatGenerated { get; set; }

  // Base probability (0..1) the action achieves its intended effect.
  public decimal BaseSuccessChance { get; set; } = 1m;

  // Base probability (0..1) the action is detected, before Suspicion scaling.
  public decimal BaseDetectionChance { get; set; }

  // Minimum days between two uses of the same non match-scoped action.
  public int CooldownDays { get; set; }
}
