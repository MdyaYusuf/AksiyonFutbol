using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.BasePlayers;
using Api.Features.Clubs;

namespace Api.Features.PlayerInstances;

public class PlayerInstance : Entity<Guid>
{
  [SetsRequiredMembers]
  public PlayerInstance()
  {
    FirstName = default!;
    LastName = default!;
  }

  public required string FirstName { get; set; }
  public required string LastName { get; set; }
  public string? Nationality { get; set; }
  public PlayerPosition Position { get; set; }
  public int Age { get; set; }
  public int HeightCm { get; set; }
  public int WeightKg { get; set; }
  public PreferredFoot PreferredFoot { get; set; }
  public int AttackPower { get; set; }
  public int DefenseStrength { get; set; }
  public int MidfieldControl { get; set; }
  public bool IsInjured { get; set; }
  public int InjuryDays { get; set; }
  public int SeasonGoals { get; set; }
  public int SeasonAssists { get; set; }
  public int SeasonYellowCards { get; set; }
  public int SeasonRedCards { get; set; }
  public decimal MarketValue { get; set; }
  public decimal Wage { get; set; }

  // Relationship properties
  public Guid ClubId { get; set; }
  public Guid? BasePlayerId { get; set; }
  public virtual Club Club { get; set; } = default!;
  public virtual BasePlayer? BasePlayer { get; set; }
}
