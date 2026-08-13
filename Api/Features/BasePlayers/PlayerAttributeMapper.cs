using Api.Features.PlayerInstances;

namespace Api.Features.BasePlayers;

public static class PlayerAttributeMapper
{
  public static PlayerAttributesDto ToDto(BasePlayer player)
  {
    return ToDto(player.Position, PlayerAttributeCalculator.ReadAttributes(player));
  }

  public static PlayerAttributesDto ToDto(PlayerInstance player)
  {
    return ToDto(player.Position, PlayerAttributeCalculator.ReadAttributes(player));
  }

  public static void ApplyToEntity(PlayerAttributesDto attributes, BasePlayer player)
  {
    ClearAllSubStats(player);
    WriteValues(player, attributes, player.Position);
  }

  public static void ApplyToEntity(PlayerAttributesDto attributes, PlayerInstance player)
  {
    ClearAllSubStats(player);
    WriteValues(player, attributes, player.Position);
  }

  public static void CopySubStats(BasePlayer source, PlayerInstance target)
  {
    target.Pace = source.Pace;
    target.Stamina = source.Stamina;
    target.Strength = source.Strength;
    target.Balance = source.Balance;
    target.Jumping = source.Jumping;
    target.Decisions = source.Decisions;
    target.Positioning = source.Positioning;
    target.Teamwork = source.Teamwork;
    target.WorkRate = source.WorkRate;
    target.Leadership = source.Leadership;
    target.Finishing = source.Finishing;
    target.OffTheBall = source.OffTheBall;
    target.Crossing = source.Crossing;
    target.LongShots = source.LongShots;
    target.Composure = source.Composure;
    target.Passing = source.Passing;
    target.Technique = source.Technique;
    target.FirstTouch = source.FirstTouch;
    target.Dribbling = source.Dribbling;
    target.Vision = source.Vision;
    target.Tackling = source.Tackling;
    target.Marking = source.Marking;
    target.Heading = source.Heading;
    target.Bravery = source.Bravery;
    target.Concentration = source.Concentration;
    target.Reflexes = source.Reflexes;
    target.OneOnOnes = source.OneOnOnes;
    target.Handling = source.Handling;
    target.RushingOut = source.RushingOut;
    target.Distribution = source.Distribution;
  }

  private static PlayerAttributesDto ToDto(PlayerPosition position, PlayerAttributeValues values)
  {
    var dto = new PlayerAttributesDto
    {
      Physical = new PhysicalAttributesDto
      {
        Pace = values.Pace,
        Stamina = values.Stamina,
        Strength = values.Strength,
        Balance = values.Balance,
        Jumping = values.Jumping
      },
      Mental = new MentalAttributesDto
      {
        Decisions = values.Decisions,
        Positioning = values.Positioning,
        Teamwork = values.Teamwork,
        WorkRate = values.WorkRate,
        Leadership = values.Leadership
      }
    };

    if (position == PlayerPosition.Goalkeeper)
    {
      return new PlayerAttributesDto
      {
        Physical = dto.Physical,
        Mental = dto.Mental,
        Goalkeeping = new GoalkeepingAttributesDto
        {
          Reflexes = values.Reflexes,
          OneOnOnes = values.OneOnOnes,
          Handling = values.Handling,
          RushingOut = values.RushingOut,
          Distribution = values.Distribution
        }
      };
    }

    return new PlayerAttributesDto
    {
      Physical = dto.Physical,
      Mental = dto.Mental,
      Attack = new OutfieldAttackAttributesDto
      {
        Finishing = values.Finishing,
        OffTheBall = values.OffTheBall,
        Crossing = values.Crossing,
        LongShots = values.LongShots,
        Composure = values.Composure
      },
      Midfield = new OutfieldMidfieldAttributesDto
      {
        Passing = values.Passing,
        Technique = values.Technique,
        FirstTouch = values.FirstTouch,
        Dribbling = values.Dribbling,
        Vision = values.Vision
      },
      Defense = new OutfieldDefenseAttributesDto
      {
        Tackling = values.Tackling,
        Marking = values.Marking,
        Heading = values.Heading,
        Bravery = values.Bravery,
        Concentration = values.Concentration
      }
    };
  }

  private static void WriteValues(
    BasePlayer player,
    PlayerAttributesDto attributes,
    PlayerPosition position)
  {
    WriteShared(player, attributes);
    WriteRoleValues(player, attributes, position);
  }

  private static void WriteValues(
    PlayerInstance player,
    PlayerAttributesDto attributes,
    PlayerPosition position)
  {
    WriteShared(player, attributes);
    WriteRoleValues(player, attributes, position);
  }

  private static void WriteShared(BasePlayer player, PlayerAttributesDto attributes)
  {
    if (attributes.Physical != null)
    {
      player.Pace = attributes.Physical.Pace;
      player.Stamina = attributes.Physical.Stamina;
      player.Strength = attributes.Physical.Strength;
      player.Balance = attributes.Physical.Balance;
      player.Jumping = attributes.Physical.Jumping;
    }

    if (attributes.Mental != null)
    {
      player.Decisions = attributes.Mental.Decisions;
      player.Positioning = attributes.Mental.Positioning;
      player.Teamwork = attributes.Mental.Teamwork;
      player.WorkRate = attributes.Mental.WorkRate;
      player.Leadership = attributes.Mental.Leadership;
    }
  }

  private static void WriteShared(PlayerInstance player, PlayerAttributesDto attributes)
  {
    if (attributes.Physical != null)
    {
      player.Pace = attributes.Physical.Pace;
      player.Stamina = attributes.Physical.Stamina;
      player.Strength = attributes.Physical.Strength;
      player.Balance = attributes.Physical.Balance;
      player.Jumping = attributes.Physical.Jumping;
    }

    if (attributes.Mental != null)
    {
      player.Decisions = attributes.Mental.Decisions;
      player.Positioning = attributes.Mental.Positioning;
      player.Teamwork = attributes.Mental.Teamwork;
      player.WorkRate = attributes.Mental.WorkRate;
      player.Leadership = attributes.Mental.Leadership;
    }
  }

  private static void WriteRoleValues(
    BasePlayer player,
    PlayerAttributesDto attributes,
    PlayerPosition position)
  {
    if (position == PlayerPosition.Goalkeeper)
    {
      if (attributes.Goalkeeping != null)
      {
        player.Reflexes = attributes.Goalkeeping.Reflexes;
        player.OneOnOnes = attributes.Goalkeeping.OneOnOnes;
        player.Handling = attributes.Goalkeeping.Handling;
        player.RushingOut = attributes.Goalkeeping.RushingOut;
        player.Distribution = attributes.Goalkeeping.Distribution;
      }

      return;
    }

    if (attributes.Attack != null)
    {
      player.Finishing = attributes.Attack.Finishing;
      player.OffTheBall = attributes.Attack.OffTheBall;
      player.Crossing = attributes.Attack.Crossing;
      player.LongShots = attributes.Attack.LongShots;
      player.Composure = attributes.Attack.Composure;
    }

    if (attributes.Midfield != null)
    {
      player.Passing = attributes.Midfield.Passing;
      player.Technique = attributes.Midfield.Technique;
      player.FirstTouch = attributes.Midfield.FirstTouch;
      player.Dribbling = attributes.Midfield.Dribbling;
      player.Vision = attributes.Midfield.Vision;
    }

    if (attributes.Defense != null)
    {
      player.Tackling = attributes.Defense.Tackling;
      player.Marking = attributes.Defense.Marking;
      player.Heading = attributes.Defense.Heading;
      player.Bravery = attributes.Defense.Bravery;
      player.Concentration = attributes.Defense.Concentration;
    }
  }

  private static void WriteRoleValues(
    PlayerInstance player,
    PlayerAttributesDto attributes,
    PlayerPosition position)
  {
    if (position == PlayerPosition.Goalkeeper)
    {
      if (attributes.Goalkeeping != null)
      {
        player.Reflexes = attributes.Goalkeeping.Reflexes;
        player.OneOnOnes = attributes.Goalkeeping.OneOnOnes;
        player.Handling = attributes.Goalkeeping.Handling;
        player.RushingOut = attributes.Goalkeeping.RushingOut;
        player.Distribution = attributes.Goalkeeping.Distribution;
      }

      return;
    }

    if (attributes.Attack != null)
    {
      player.Finishing = attributes.Attack.Finishing;
      player.OffTheBall = attributes.Attack.OffTheBall;
      player.Crossing = attributes.Attack.Crossing;
      player.LongShots = attributes.Attack.LongShots;
      player.Composure = attributes.Attack.Composure;
    }

    if (attributes.Midfield != null)
    {
      player.Passing = attributes.Midfield.Passing;
      player.Technique = attributes.Midfield.Technique;
      player.FirstTouch = attributes.Midfield.FirstTouch;
      player.Dribbling = attributes.Midfield.Dribbling;
      player.Vision = attributes.Midfield.Vision;
    }

    if (attributes.Defense != null)
    {
      player.Tackling = attributes.Defense.Tackling;
      player.Marking = attributes.Defense.Marking;
      player.Heading = attributes.Defense.Heading;
      player.Bravery = attributes.Defense.Bravery;
      player.Concentration = attributes.Defense.Concentration;
    }
  }

  private static void ClearAllSubStats(BasePlayer player)
  {
    player.Pace = 0;
    player.Stamina = 0;
    player.Strength = 0;
    player.Balance = 0;
    player.Jumping = 0;
    player.Decisions = 0;
    player.Positioning = 0;
    player.Teamwork = 0;
    player.WorkRate = 0;
    player.Leadership = 0;
    player.Finishing = 0;
    player.OffTheBall = 0;
    player.Crossing = 0;
    player.LongShots = 0;
    player.Composure = 0;
    player.Passing = 0;
    player.Technique = 0;
    player.FirstTouch = 0;
    player.Dribbling = 0;
    player.Vision = 0;
    player.Tackling = 0;
    player.Marking = 0;
    player.Heading = 0;
    player.Bravery = 0;
    player.Concentration = 0;
    player.Reflexes = 0;
    player.OneOnOnes = 0;
    player.Handling = 0;
    player.RushingOut = 0;
    player.Distribution = 0;
  }

  private static void ClearAllSubStats(PlayerInstance player)
  {
    player.Pace = 0;
    player.Stamina = 0;
    player.Strength = 0;
    player.Balance = 0;
    player.Jumping = 0;
    player.Decisions = 0;
    player.Positioning = 0;
    player.Teamwork = 0;
    player.WorkRate = 0;
    player.Leadership = 0;
    player.Finishing = 0;
    player.OffTheBall = 0;
    player.Crossing = 0;
    player.LongShots = 0;
    player.Composure = 0;
    player.Passing = 0;
    player.Technique = 0;
    player.FirstTouch = 0;
    player.Dribbling = 0;
    player.Vision = 0;
    player.Tackling = 0;
    player.Marking = 0;
    player.Heading = 0;
    player.Bravery = 0;
    player.Concentration = 0;
    player.Reflexes = 0;
    player.OneOnOnes = 0;
    player.Handling = 0;
    player.RushingOut = 0;
    player.Distribution = 0;
  }
}
