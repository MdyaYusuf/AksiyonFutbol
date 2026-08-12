namespace Api.Features.BasePlayers;

/// <summary>
/// Nested attribute payload. Outfield players use Attack/Midfield/Defense.
/// Goalkeepers use Goalkeeping/Command/Distribution. Unused groups are null.
/// </summary>
public sealed class PlayerAttributesDto
{
  public OutfieldAttackAttributesDto? Attack { get; init; }
  public OutfieldMidfieldAttributesDto? Midfield { get; init; }
  public OutfieldDefenseAttributesDto? Defense { get; init; }
  public GoalkeepingAttributesDto? Goalkeeping { get; init; }
  public CommandAttributesDto? Command { get; init; }
  public DistributionAttributesDto? Distribution { get; init; }
}

public sealed class OutfieldAttackAttributesDto
{
  public int Pace { get; init; }
  public int Finishing { get; init; }
  public int OffTheBall { get; init; }
  public int Composure { get; init; }
}

public sealed class OutfieldMidfieldAttributesDto
{
  public int Passing { get; init; }
  public int Technique { get; init; }
  public int Stamina { get; init; }
  public int Decisions { get; init; }
}

public sealed class OutfieldDefenseAttributesDto
{
  public int Strength { get; init; }
  public int Tackling { get; init; }
  public int Marking { get; init; }
  public int Bravery { get; init; }
}

public sealed class GoalkeepingAttributesDto
{
  public int Reflexes { get; init; }
  public int OneOnOnes { get; init; }
  public int AerialReach { get; init; }
  public int Positioning { get; init; }
}

public sealed class CommandAttributesDto
{
  public int FirstTouch { get; init; }
  public int Handling { get; init; }
  public int RushingOut { get; init; }
}

public sealed class DistributionAttributesDto
{
  public int Throwing { get; init; }
  public int Kicking { get; init; }
  public int Vision { get; init; }
}
