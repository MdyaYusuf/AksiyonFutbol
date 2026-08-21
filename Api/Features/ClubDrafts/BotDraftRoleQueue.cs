using Api.Core.Options;
using Api.Features.BasePlayers;

namespace Api.Features.ClubDrafts;

public static class BotDraftRoleQueue
{
  public static List<BotDraftRoleSlot> Build(GameOptions options)
  {
    List<BotDraftRoleSlot> goalkeeperSlots = BuildPositionBlock(
      PlayerPosition.Goalkeeper,
      options.StarterSquadGoalkeepers,
      [BotDraftRole.Starter, BotDraftRole.Backup]);

    List<BotDraftRoleSlot> defenderSlots = BuildPositionBlock(
      PlayerPosition.Defender,
      options.StarterSquadDefenders,
      [
        BotDraftRole.Key,
        BotDraftRole.Key,
        BotDraftRole.Rotation,
        BotDraftRole.Rotation,
        BotDraftRole.Cheap
      ]);

    List<BotDraftRoleSlot> midfielderSlots = BuildPositionBlock(
      PlayerPosition.Midfielder,
      options.StarterSquadMidfielders,
      [
        BotDraftRole.Key,
        BotDraftRole.Engine,
        BotDraftRole.Engine,
        BotDraftRole.Rotation,
        BotDraftRole.Cheap
      ]);

    List<BotDraftRoleSlot> forwardSlots = BuildPositionBlock(
      PlayerPosition.Forward,
      options.StarterSquadForwards,
      [
        BotDraftRole.Star,
        BotDraftRole.Support,
        BotDraftRole.Support,
        BotDraftRole.Cheap
      ]);

    List<List<BotDraftRoleSlot>> outfieldBlocks =
    [
      defenderSlots,
      midfielderSlots,
      forwardSlots
    ];

    ShuffleInPlace(outfieldBlocks);

    List<BotDraftRoleSlot> queue = [];
    queue.AddRange(goalkeeperSlots);

    foreach (List<BotDraftRoleSlot> block in outfieldBlocks)
    {
      queue.AddRange(block);
    }

    return queue;
  }

  public static decimal GetFeeMultiplier(BotDraftRole role, BotDraftOptions botDraft)
  {
    if (role == BotDraftRole.Star)
    {
      return botDraft.RoleFeeMultiplierStar;
    }

    if (role == BotDraftRole.Key)
    {
      return botDraft.RoleFeeMultiplierKey;
    }

    if (role == BotDraftRole.Starter)
    {
      return botDraft.RoleFeeMultiplierStarter;
    }

    if (role == BotDraftRole.Engine)
    {
      return botDraft.RoleFeeMultiplierEngine;
    }

    if (role == BotDraftRole.Support)
    {
      return botDraft.RoleFeeMultiplierSupport;
    }

    if (role == BotDraftRole.Rotation)
    {
      return botDraft.RoleFeeMultiplierRotation;
    }

    if (role == BotDraftRole.Backup)
    {
      return botDraft.RoleFeeMultiplierBackup;
    }

    return botDraft.RoleFeeMultiplierCheap;
  }

  public static decimal GetWageMultiplier(BotDraftRole role, BotDraftOptions botDraft)
  {
    if (role == BotDraftRole.Star)
    {
      return botDraft.RoleWageMultiplierStar;
    }

    if (role == BotDraftRole.Key)
    {
      return botDraft.RoleWageMultiplierKey;
    }

    if (role == BotDraftRole.Starter)
    {
      return botDraft.RoleWageMultiplierStarter;
    }

    if (role == BotDraftRole.Engine)
    {
      return botDraft.RoleWageMultiplierEngine;
    }

    if (role == BotDraftRole.Support)
    {
      return botDraft.RoleWageMultiplierSupport;
    }

    if (role == BotDraftRole.Rotation)
    {
      return botDraft.RoleWageMultiplierRotation;
    }

    if (role == BotDraftRole.Backup)
    {
      return botDraft.RoleWageMultiplierBackup;
    }

    return botDraft.RoleWageMultiplierCheap;
  }

  private static List<BotDraftRoleSlot> BuildPositionBlock(
    PlayerPosition position,
    int required,
    BotDraftRole[] pattern)
  {
    List<BotDraftRole> roles = FitPattern(pattern, required);
    ShuffleInPlace(roles);

    List<BotDraftRoleSlot> slots = [];

    foreach (BotDraftRole role in roles)
    {
      slots.Add(new BotDraftRoleSlot(position, role));
    }

    return slots;
  }

  private static List<BotDraftRole> FitPattern(BotDraftRole[] pattern, int required)
  {
    List<BotDraftRole> roles = [];

    if (required <= 0)
    {
      return roles;
    }

    for (int i = 0; i < required; i++)
    {
      if (i < pattern.Length)
      {
        roles.Add(pattern[i]);
      }
      else
      {
        roles.Add(BotDraftRole.Cheap);
      }
    }

    return roles;
  }

  private static void ShuffleInPlace<T>(IList<T> items)
  {
    for (int i = items.Count - 1; i > 0; i--)
    {
      int swapIndex = Random.Shared.Next(i + 1);
      (items[i], items[swapIndex]) = (items[swapIndex], items[i]);
    }
  }
}
