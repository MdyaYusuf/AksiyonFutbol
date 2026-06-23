using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;

namespace Api.Features.Referees;

public class Referee : Entity<int>
{
  [SetsRequiredMembers]
  public Referee()
  {
    Name = default!;
  }

  public required string Name { get; set; }
  public int BriberyDifficulty { get; set; }
  public RefereePersonalityType PersonalityType { get; set; }
  public string? Biography { get; set; }
}
