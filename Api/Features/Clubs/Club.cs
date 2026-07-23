using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.ClubLineups;
using Api.Features.ClubPresidents;
using Api.Features.Facilities;
using Api.Features.LeagueDivisions;
using Api.Features.PlayerInstances;

namespace Api.Features.Clubs;

public class Club : Entity<Guid>
{
  [SetsRequiredMembers]
  public Club()
  {
    Players = new HashSet<PlayerInstance>();
    Facilities = new HashSet<ClubFacility>();

    Name = default!;
    Morale = 50;
    Chemistry = 50;
    Discipline = 50;
  }

  public required string Name { get; set; }
  public bool IsBot { get; set; }
  public decimal Cash { get; set; }
  public decimal WageBudget { get; set; }
  public int Morale { get; set; }
  public int Chemistry { get; set; }
  public int Discipline { get; set; }

  // Relationship properties
  public Guid? PresidentId { get; set; }
  public int DivisionId { get; set; }
  public virtual ClubPresident? President { get; set; }
  public virtual LeagueDivision Division { get; set; } = default!;
  public virtual ClubLineup? Lineup { get; set; }
  public virtual ICollection<PlayerInstance> Players { get; set; }
  public virtual ICollection<ClubFacility> Facilities { get; set; }
}
