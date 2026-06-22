using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;

namespace Api.Features.BasePlayers;

public class BasePlayer : Entity<Guid>
{
  [SetsRequiredMembers]
  public BasePlayer()
  {
    DefaultFirstName = default!;
    DefaultLastName = default!;
  }

  public required string DefaultFirstName { get; set; }
  public required string DefaultLastName { get; set; }
  public string? Nationality { get; set; }
  public PlayerPosition Position { get; set; }
  public int Age { get; set; }
  public int AttackPower { get; set; }
  public int DefenseStrength { get; set; }
  public int MidfieldControl { get; set; }
}
