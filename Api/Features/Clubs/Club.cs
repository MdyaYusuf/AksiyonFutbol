using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.ClubLineups;
using Api.Features.ClubPresidents;
using Api.Features.Facilities;
using Api.Features.LeagueDivisions;
using Api.Features.PlayerInstances;
using Api.Features.ClubDrafts;

namespace Api.Features.Clubs;

public class Club : Entity<Guid>
{
  [SetsRequiredMembers]
  public Club()
  {
    Players = new HashSet<PlayerInstance>();
    Facilities = new HashSet<ClubFacility>();
    DraftPicks = new HashSet<ClubDraftPick>();

    Name = default!;
    Morale = 50;
    Chemistry = 50;
    Discipline = 50;
    Suspicion = 0;
    LifecycleStatus = ClubLifecycleStatus.Drafting;
  }

  public required string Name { get; set; }
  public bool IsBot { get; set; }
  public decimal Cash { get; set; }
  public decimal WageBudget { get; set; }
  public int Morale { get; set; }
  public int Chemistry { get; set; }
  public int Discipline { get; set; }

  // Accumulated "Heat" from shady actions. Higher values increase detection risk
  // and scale investigation consequences; decays over time after matches.
  public int Suspicion { get; set; }

  public ClubLifecycleStatus LifecycleStatus { get; set; }
  public LeagueTier? PlacementTargetTier { get; set; }
  public int? TutorialDivisionId { get; set; }

  // Relationship properties
  public Guid? PresidentId { get; set; }
  public int? DivisionId { get; set; }
  public virtual ClubPresident? President { get; set; }
  public virtual LeagueDivision? Division { get; set; }
  public virtual LeagueDivision? TutorialDivision { get; set; }
  public virtual ClubLineup? Lineup { get; set; }
  public virtual ICollection<PlayerInstance> Players { get; set; }
  public virtual ICollection<ClubFacility> Facilities { get; set; }
  public virtual ICollection<ClubDraftPick> DraftPicks { get; set; }
}
