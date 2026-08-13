using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.PlayerInstances;

namespace Api.Features.BasePlayers;

public class BasePlayer : Entity<Guid>
{
  [SetsRequiredMembers]
  public BasePlayer()
  {
    PlayerInstances = new HashSet<PlayerInstance>();

    DefaultFirstName = default!;
    DefaultLastName = default!;
  }

  public required string DefaultFirstName { get; set; }
  public required string DefaultLastName { get; set; }
  public string? Nationality { get; set; }
  public PlayerPosition Position { get; set; }
  public int Age { get; set; }
  public int HeightCm { get; set; }
  public int WeightKg { get; set; }
  public PreferredFoot PreferredFoot { get; set; }

  // Physical
  public int Pace { get; set; }
  public int Stamina { get; set; }
  public int Strength { get; set; }
  public int Balance { get; set; }
  public int Jumping { get; set; }

  // Mental
  public int Decisions { get; set; }
  public int Positioning { get; set; }
  public int Teamwork { get; set; }
  public int WorkRate { get; set; }
  public int Leadership { get; set; }

  // Outfield attack
  public int Finishing { get; set; }
  public int OffTheBall { get; set; }
  public int Crossing { get; set; }
  public int LongShots { get; set; }
  public int Composure { get; set; }

  // Outfield midfield
  public int Passing { get; set; }
  public int Technique { get; set; }
  public int FirstTouch { get; set; }
  public int Dribbling { get; set; }
  public int Vision { get; set; }

  // Outfield defense
  public int Tackling { get; set; }
  public int Marking { get; set; }
  public int Heading { get; set; }
  public int Bravery { get; set; }
  public int Concentration { get; set; }

  // Goalkeeping
  public int Reflexes { get; set; }
  public int OneOnOnes { get; set; }
  public int Handling { get; set; }
  public int RushingOut { get; set; }
  public int Distribution { get; set; }

  // Persisted mains computed from role-relevant sub-stats
  public int AttackPower { get; set; }
  public int DefenseStrength { get; set; }
  public int MidfieldControl { get; set; }

  // Relationship properties
  public virtual ICollection<PlayerInstance> PlayerInstances { get; set; }
}
