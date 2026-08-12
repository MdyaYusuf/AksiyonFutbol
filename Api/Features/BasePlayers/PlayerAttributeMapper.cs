using Api.Features.PlayerInstances;

namespace Api.Features.BasePlayers;

public static class PlayerAttributeMapper
{
  public static PlayerAttributesDto ToDto(BasePlayer player)
  {
    return ToDto(player.Position, ReadValues(player));
  }

  public static PlayerAttributesDto ToDto(PlayerInstance player)
  {
    return ToDto(player.Position, ReadValues(player));
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
    target.Finishing = source.Finishing;
    target.OffTheBall = source.OffTheBall;
    target.Composure = source.Composure;
    target.Passing = source.Passing;
    target.Technique = source.Technique;
    target.Stamina = source.Stamina;
    target.Decisions = source.Decisions;
    target.Strength = source.Strength;
    target.Tackling = source.Tackling;
    target.Marking = source.Marking;
    target.Bravery = source.Bravery;
    target.Throwing = source.Throwing;
    target.Kicking = source.Kicking;
    target.Vision = source.Vision;
    target.FirstTouch = source.FirstTouch;
    target.Handling = source.Handling;
    target.RushingOut = source.RushingOut;
    target.Reflexes = source.Reflexes;
    target.OneOnOnes = source.OneOnOnes;
    target.AerialReach = source.AerialReach;
    target.Positioning = source.Positioning;
  }

  private static PlayerAttributesDto ToDto(PlayerPosition position, PlayerAttributeValues values)
  {
    if (position == PlayerPosition.Goalkeeper)
    {
      return new PlayerAttributesDto
      {
        Goalkeeping = new GoalkeepingAttributesDto
        {
          Reflexes = values.Reflexes,
          OneOnOnes = values.OneOnOnes,
          AerialReach = values.AerialReach,
          Positioning = values.Positioning
        },
        Command = new CommandAttributesDto
        {
          FirstTouch = values.FirstTouch,
          Handling = values.Handling,
          RushingOut = values.RushingOut
        },
        Distribution = new DistributionAttributesDto
        {
          Throwing = values.Throwing,
          Kicking = values.Kicking,
          Vision = values.Vision
        }
      };
    }

    return new PlayerAttributesDto
    {
      Attack = new OutfieldAttackAttributesDto
      {
        Pace = values.Pace,
        Finishing = values.Finishing,
        OffTheBall = values.OffTheBall,
        Composure = values.Composure
      },
      Midfield = new OutfieldMidfieldAttributesDto
      {
        Passing = values.Passing,
        Technique = values.Technique,
        Stamina = values.Stamina,
        Decisions = values.Decisions
      },
      Defense = new OutfieldDefenseAttributesDto
      {
        Strength = values.Strength,
        Tackling = values.Tackling,
        Marking = values.Marking,
        Bravery = values.Bravery
      }
    };
  }

  private static void WriteValues(
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
        player.AerialReach = attributes.Goalkeeping.AerialReach;
        player.Positioning = attributes.Goalkeeping.Positioning;
      }

      if (attributes.Command != null)
      {
        player.FirstTouch = attributes.Command.FirstTouch;
        player.Handling = attributes.Command.Handling;
        player.RushingOut = attributes.Command.RushingOut;
      }

      if (attributes.Distribution != null)
      {
        player.Throwing = attributes.Distribution.Throwing;
        player.Kicking = attributes.Distribution.Kicking;
        player.Vision = attributes.Distribution.Vision;
      }

      return;
    }

    if (attributes.Attack != null)
    {
      player.Pace = attributes.Attack.Pace;
      player.Finishing = attributes.Attack.Finishing;
      player.OffTheBall = attributes.Attack.OffTheBall;
      player.Composure = attributes.Attack.Composure;
    }

    if (attributes.Midfield != null)
    {
      player.Passing = attributes.Midfield.Passing;
      player.Technique = attributes.Midfield.Technique;
      player.Stamina = attributes.Midfield.Stamina;
      player.Decisions = attributes.Midfield.Decisions;
    }

    if (attributes.Defense != null)
    {
      player.Strength = attributes.Defense.Strength;
      player.Tackling = attributes.Defense.Tackling;
      player.Marking = attributes.Defense.Marking;
      player.Bravery = attributes.Defense.Bravery;
    }
  }

  private static void WriteValues(
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
        player.AerialReach = attributes.Goalkeeping.AerialReach;
        player.Positioning = attributes.Goalkeeping.Positioning;
      }

      if (attributes.Command != null)
      {
        player.FirstTouch = attributes.Command.FirstTouch;
        player.Handling = attributes.Command.Handling;
        player.RushingOut = attributes.Command.RushingOut;
      }

      if (attributes.Distribution != null)
      {
        player.Throwing = attributes.Distribution.Throwing;
        player.Kicking = attributes.Distribution.Kicking;
        player.Vision = attributes.Distribution.Vision;
      }

      return;
    }

    if (attributes.Attack != null)
    {
      player.Pace = attributes.Attack.Pace;
      player.Finishing = attributes.Attack.Finishing;
      player.OffTheBall = attributes.Attack.OffTheBall;
      player.Composure = attributes.Attack.Composure;
    }

    if (attributes.Midfield != null)
    {
      player.Passing = attributes.Midfield.Passing;
      player.Technique = attributes.Midfield.Technique;
      player.Stamina = attributes.Midfield.Stamina;
      player.Decisions = attributes.Midfield.Decisions;
    }

    if (attributes.Defense != null)
    {
      player.Strength = attributes.Defense.Strength;
      player.Tackling = attributes.Defense.Tackling;
      player.Marking = attributes.Defense.Marking;
      player.Bravery = attributes.Defense.Bravery;
    }
  }

  private static void ClearAllSubStats(BasePlayer player)
  {
    player.Pace = 0;
    player.Finishing = 0;
    player.OffTheBall = 0;
    player.Composure = 0;
    player.Passing = 0;
    player.Technique = 0;
    player.Stamina = 0;
    player.Decisions = 0;
    player.Strength = 0;
    player.Tackling = 0;
    player.Marking = 0;
    player.Bravery = 0;
    player.Throwing = 0;
    player.Kicking = 0;
    player.Vision = 0;
    player.FirstTouch = 0;
    player.Handling = 0;
    player.RushingOut = 0;
    player.Reflexes = 0;
    player.OneOnOnes = 0;
    player.AerialReach = 0;
    player.Positioning = 0;
  }

  private static void ClearAllSubStats(PlayerInstance player)
  {
    player.Pace = 0;
    player.Finishing = 0;
    player.OffTheBall = 0;
    player.Composure = 0;
    player.Passing = 0;
    player.Technique = 0;
    player.Stamina = 0;
    player.Decisions = 0;
    player.Strength = 0;
    player.Tackling = 0;
    player.Marking = 0;
    player.Bravery = 0;
    player.Throwing = 0;
    player.Kicking = 0;
    player.Vision = 0;
    player.FirstTouch = 0;
    player.Handling = 0;
    player.RushingOut = 0;
    player.Reflexes = 0;
    player.OneOnOnes = 0;
    player.AerialReach = 0;
    player.Positioning = 0;
  }

  private static PlayerAttributeValues ReadValues(BasePlayer player)
  {
    return new PlayerAttributeValues(
      Pace: player.Pace,
      Finishing: player.Finishing,
      OffTheBall: player.OffTheBall,
      Composure: player.Composure,
      Passing: player.Passing,
      Technique: player.Technique,
      Stamina: player.Stamina,
      Decisions: player.Decisions,
      Strength: player.Strength,
      Tackling: player.Tackling,
      Marking: player.Marking,
      Bravery: player.Bravery,
      Throwing: player.Throwing,
      Kicking: player.Kicking,
      Vision: player.Vision,
      FirstTouch: player.FirstTouch,
      Handling: player.Handling,
      RushingOut: player.RushingOut,
      Reflexes: player.Reflexes,
      OneOnOnes: player.OneOnOnes,
      AerialReach: player.AerialReach,
      Positioning: player.Positioning);
  }

  private static PlayerAttributeValues ReadValues(PlayerInstance player)
  {
    return new PlayerAttributeValues(
      Pace: player.Pace,
      Finishing: player.Finishing,
      OffTheBall: player.OffTheBall,
      Composure: player.Composure,
      Passing: player.Passing,
      Technique: player.Technique,
      Stamina: player.Stamina,
      Decisions: player.Decisions,
      Strength: player.Strength,
      Tackling: player.Tackling,
      Marking: player.Marking,
      Bravery: player.Bravery,
      Throwing: player.Throwing,
      Kicking: player.Kicking,
      Vision: player.Vision,
      FirstTouch: player.FirstTouch,
      Handling: player.Handling,
      RushingOut: player.RushingOut,
      Reflexes: player.Reflexes,
      OneOnOnes: player.OneOnOnes,
      AerialReach: player.AerialReach,
      Positioning: player.Positioning);
  }
}
