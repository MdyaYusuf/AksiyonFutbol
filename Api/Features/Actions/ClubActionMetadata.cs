namespace Api.Features.Actions;

// Static, code-owned descriptive data for an action: display text and structural
// flags that define how the action behaves. Balancing numbers (cost, heat,
// chances, cooldown) live in GameOptions and are merged in at runtime by
// ClubActionProvider into a ClubActionDefinition.
public sealed record ClubActionMetadata
{
  public required ClubActionType Type { get; init; }
  public required ClubActionCategory Category { get; init; }
  public required string DisplayName { get; init; }
  public required string Description { get; init; }

  // Shady flag drives Heat/detection; player-facing label is "Gray Area".
  public bool IsShady { get; init; }

  // Match-scoped actions target the next unplayed fixture and allow a single
  // attempt per match. Non match-scoped actions use a cooldown instead.
  public bool IsMatchScoped { get; init; }

  // President attribute gates. 0 means no minimum.
  public int MinCharisma { get; init; }
  public int MinAuthority { get; init; }
  public int MinIntegrity { get; init; }
  public int MinCunning { get; init; }
  public int MinConnections { get; init; }

  // Legitimacy gate (ReputationPoints). 0 means no minimum.
  public int MinLegitimacy { get; init; }

  // Infamy ≥ threshold unlock required (shady tier II progression).
  public bool RequiresShadyTierII { get; init; }
}
