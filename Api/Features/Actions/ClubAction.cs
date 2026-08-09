using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;
using Api.Features.Matches;

namespace Api.Features.Actions;

// A performed/recorded action taken by a club. The set of available actions and
// their balancing live in ClubActionCatalog (metadata) and GameOptions (numbers).
public class ClubAction : Entity<Guid>
{
  [SetsRequiredMembers]
  public ClubAction()
  {
    Outcome = ClubActionOutcome.Failed;
  }

  public ClubActionType ActionType { get; set; }
  public ClubActionOutcome Outcome { get; set; }
  public bool WasDetected { get; set; }
  public int HeatGenerated { get; set; }
  public decimal CashSpent { get; set; }
  public decimal SuccessChance { get; set; }
  public decimal DetectionChance { get; set; }

  public Guid ClubId { get; set; }
  // Null for non match-scoped actions (squad, most politics).
  public Guid? MatchId { get; set; }

  public virtual Club Club { get; set; } = default!;
  public virtual Match? Match { get; set; }
}
