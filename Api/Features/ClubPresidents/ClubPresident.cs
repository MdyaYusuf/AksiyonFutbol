using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;
using Api.Features.Users;

namespace Api.Features.ClubPresidents;

public class ClubPresident : Entity<Guid>
{
  [SetsRequiredMembers]
  public ClubPresident()
  {
    Name = default!;
    Title = "Amateur";
  }

  public required string Name { get; set; }
  public int ReputationPoints { get; set; }
  public string? Title { get; set; }

  // Build attributes (1–5). Creation spends a fixed point budget on top of base 1.
  public int Charisma { get; set; } = 1;
  public int Authority { get; set; } = 1;
  public int Integrity { get; set; } = 1;
  public int Cunning { get; set; } = 1;
  public int Connections { get; set; } = 1;

  // Relationship properties
  public Guid UserId { get; set; }
  public virtual User User { get; set; } = default!;
  public virtual Club? Club { get; set; }
}
