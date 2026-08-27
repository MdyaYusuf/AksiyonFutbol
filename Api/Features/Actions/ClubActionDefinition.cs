namespace Api.Features.Actions;

// Runtime shape used by the service, produced by ClubActionProvider by merging
// static ClubActionCatalog metadata with the GameOptions balancing numbers.
public sealed record ClubActionDefinition
{
  public required ClubActionType Type { get; init; }
  public required ClubActionCategory Category { get; init; }
  public required string DisplayName { get; init; }
  public required string Description { get; init; }

  // Cash removed from the club when the action is performed.
  public decimal Cost { get; init; }

  // Suspicion ("Heat") added on execution. Only meaningful when IsShady is true.
  public int HeatGenerated { get; init; }

  // Base probability (0..1) the action achieves its intended effect.
  public decimal BaseSuccessChance { get; init; } = 1m;

  // Base probability (0..1) the action is detected, before Suspicion scaling.
  public decimal BaseDetectionChance { get; init; }

  // Shady actions generate Heat and carry detection risk; legit ones do not.
  public bool IsShady { get; init; }

  // Match-scoped actions target the next unplayed fixture and allow a single
  // attempt per match. Non match-scoped actions use CooldownDays instead.
  public bool IsMatchScoped { get; init; }

  // Minimum days between two uses of the same non match-scoped action.
  public int CooldownDays { get; init; }

  // President attribute gates. 0 means no minimum.
  public int MinCharisma { get; init; }
  public int MinAuthority { get; init; }
  public int MinIntegrity { get; init; }
  public int MinCunning { get; init; }
  public int MinConnections { get; init; }
}
