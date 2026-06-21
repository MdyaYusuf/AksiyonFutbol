using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;

namespace Api.Features.LeagueDivisions;

public class LeagueDivision : Entity<int>
{
  [SetsRequiredMembers]
  public LeagueDivision()
  {
    Clubs = new HashSet<Club>();

    Name = default!;
    CurrentMatchWeek = 1;
  }

  public required string Name { get; set; }
  public int Tier { get; set; }
  public int GroupNumber { get; set; }
  public int CurrentMatchWeek { get; set; }

  // Relationship properties
  public virtual ICollection<Club> Clubs { get; set; }
}
