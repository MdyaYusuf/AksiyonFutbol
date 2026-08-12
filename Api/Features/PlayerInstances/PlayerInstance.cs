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

  // Outfield attack
  public int Pace { get; set; }
  public int Finishing { get; set; }
  public int OffTheBall { get; set; }
  public int Composure { get; set; }

  // Outfield midfield
  public int Passing { get; set; }
  public int Technique { get; set; }
  public int Stamina { get; set; }
  public int Decisions { get; set; }

  // Outfield defense
  public int Strength { get; set; }
  public int Tackling { get; set; }
  public int Marking { get; set; }
  public int Bravery { get; set; }

  // Goalkeeper attack (distribution)
  public int Throwing { get; set; }
  public int Kicking { get; set; }
  public int Vision { get; set; }

  // Goalkeeper midfield
  public int FirstTouch { get; set; }
  public int Handling { get; set; }
  public int RushingOut { get; set; }

  // Goalkeeper defense
  public int Reflexes { get; set; }
  public int OneOnOnes { get; set; }
  public int AerialReach { get; set; }
  public int Positioning { get; set; }

  // Persisted mains computed from role-relevant sub-stats
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
