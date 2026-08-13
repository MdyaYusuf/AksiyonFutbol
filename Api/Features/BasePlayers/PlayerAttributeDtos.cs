namespace Api.Features.BasePlayers;

/// <summary>
/// Nested attribute payload. Physical and Mental are always present.
/// Outfield players use Attack/Midfield/Defense. Goalkeepers use Goalkeeping.
/// Unused groups are null.
/// </summary>
public sealed class PlayerAttributesDto
{
  public PhysicalAttributesDto? Physical { get; init; }
  public MentalAttributesDto? Mental { get; init; }
  public OutfieldAttackAttributesDto? Attack { get; init; }
  public OutfieldMidfieldAttributesDto? Midfield { get; init; }
  public OutfieldDefenseAttributesDto? Defense { get; init; }
  public GoalkeepingAttributesDto? Goalkeeping { get; init; }
}

public sealed class PhysicalAttributesDto
{
  public int Pace { get; init; }
  public int Stamina { get; init; }
  public int Strength { get; init; }
  public int Balance { get; init; }
  public int Jumping { get; init; }
}

public sealed class MentalAttributesDto
{
  public int Decisions { get; init; }
  public int Positioning { get; init; }
  public int Teamwork { get; init; }
  public int WorkRate { get; init; }
  public int Leadership { get; init; }
}

public sealed class OutfieldAttackAttributesDto
{
  public int Finishing { get; init; }
  public int OffTheBall { get; init; }
  public int Crossing { get; init; }
  public int LongShots { get; init; }
  public int Composure { get; init; }
}

public sealed class OutfieldMidfieldAttributesDto
{
  public int Passing { get; init; }
  public int Technique { get; init; }
  public int FirstTouch { get; init; }
  public int Dribbling { get; init; }
  public int Vision { get; init; }
}

public sealed class OutfieldDefenseAttributesDto
{
  public int Tackling { get; init; }
  public int Marking { get; init; }
  public int Heading { get; init; }
  public int Bravery { get; init; }
  public int Concentration { get; init; }
}

public sealed class GoalkeepingAttributesDto
{
  public int Reflexes { get; init; }
  public int OneOnOnes { get; init; }
  public int Handling { get; init; }
  public int RushingOut { get; init; }
  public int Distribution { get; init; }
}
