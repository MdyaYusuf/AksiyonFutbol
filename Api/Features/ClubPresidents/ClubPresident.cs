using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
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

  // Relationship properties
  public Guid UserId { get; set; }
  public virtual User User { get; set; } = default!;
}
