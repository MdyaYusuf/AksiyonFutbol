using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;

namespace Api.Features.ClubDrafts;

/// <summary>
/// Shared bot squad builder for tutorial finalize, competitive seating, and (later) admin bots.
/// Clones from a read-only catalog; does not deplete templates for other clubs.
/// </summary>
public static class BotSquadAutoDraft
{
  public static List<BasePlayer> SelectSquad(
    IReadOnlyList<BasePlayer> catalog,
    GameOptions options,
    decimal cash,
    decimal wageBudget,
    BotDraftProfileKind profile,
    BotDraftStyle style)
  {
    _ = profile;
    _ = style;

    ClubDraftBusinessRules.EnsureCompositionIsValid(options);

    BotDraftOptions botDraft = options.BotDraft;
    List<BotDraftRoleSlot> remainingSlots = BotDraftRoleQueue.Build(options);
    List<BasePlayer> selected = [];
    decimal remainingCash = cash;
    decimal remainingWage = wageBudget;
    decimal plannedCashLeft = cash * botDraft.TargetCashSpendRatio;
    decimal plannedWageLeft = wageBudget * botDraft.TargetWageSpendRatio;

    while (remainingSlots.Count > 0)
    {
      BotDraftRoleSlot slot = remainingSlots[0];
      List<PlayerPosition> slotsAfterCurrent = remainingSlots
        .Skip(1)
        .Select(s => s.Position)
        .ToList();
      int slotsLeft = remainingSlots.Count;

      decimal baseTargetFee = plannedCashLeft / slotsLeft;
      decimal baseTargetWage = plannedWageLeft / slotsLeft;
      decimal targetFee = baseTargetFee * BotDraftRoleQueue.GetFeeMultiplier(slot.Role, botDraft);
      decimal targetWage = baseTargetWage * BotDraftRoleQueue.GetWageMultiplier(slot.Role, botDraft);

      BasePlayer? pick = SelectPick(
        catalog,
        selected,
        slot.Position,
        remainingCash,
        remainingWage,
        slotsAfterCurrent,
        targetFee,
        targetWage,
        botDraft);

      if (pick == null)
      {
        throw new BusinessException(
          $"Bot draft için yeterli {slot.Position} adayı kalmadı. Katalog veya bütçe yetersiz.");
      }

      selected.Add(pick);
      remainingCash -= pick.DraftFee;
      remainingWage -= pick.Wage;
      plannedCashLeft = Math.Max(0m, plannedCashLeft - pick.DraftFee);
      plannedWageLeft = Math.Max(0m, plannedWageLeft - pick.Wage);
      remainingSlots.RemoveAt(0);
    }

    return selected;
  }

  private static BasePlayer? SelectPick(
    IReadOnlyList<BasePlayer> catalog,
    List<BasePlayer> alreadySelected,
    PlayerPosition position,
    decimal remainingCash,
    decimal remainingWage,
    List<PlayerPosition> slotsAfterCurrent,
    decimal targetFee,
    decimal targetWage,
    BotDraftOptions botDraft)
  {
    HashSet<Guid> selectedIds = alreadySelected.Select(p => p.Id).ToHashSet();

    List<BasePlayer> affordable = catalog
      .Where(bp => !selectedIds.Contains(bp.Id))
      .Where(bp => bp.Position == position)
      .Where(bp => bp.DraftFee <= remainingCash)
      .Where(bp => bp.Wage <= remainingWage)
      .Where(bp => LeavesEnoughReserve(
        catalog,
        selectedIds,
        bp,
        remainingCash,
        remainingWage,
        slotsAfterCurrent))
      .ToList();

    if (affordable.Count == 0)
    {
      return null;
    }

    decimal slack = botDraft.FeeTargetSlack;
    List<BasePlayer>? shortlist = BuildNearTargetShortlist(
      affordable,
      targetFee,
      targetWage,
      slack,
      botDraft.ShortlistSize);

    if (shortlist == null || shortlist.Count == 0)
    {
      shortlist = BuildNearTargetShortlist(
        affordable,
        targetFee,
        targetWage,
        Math.Min(1m, slack * 2m),
        botDraft.ShortlistSize);
    }

    if (shortlist == null || shortlist.Count == 0)
    {
      shortlist = affordable
        .OrderBy(bp => bp.DraftFee)
        .ThenBy(bp => bp.Wage)
        .ThenByDescending(bp => BasePlayerRatingCalculator.Calculate(bp))
        .ThenBy(bp => bp.Id)
        .Take(botDraft.ShortlistSize)
        .ToList();
    }

    if (shortlist.Count == 0)
    {
      return null;
    }

    return shortlist[Random.Shared.Next(shortlist.Count)];
  }

  private static bool LeavesEnoughReserve(
    IReadOnlyList<BasePlayer> catalog,
    HashSet<Guid> selectedIds,
    BasePlayer candidate,
    decimal remainingCash,
    decimal remainingWage,
    List<PlayerPosition> slotsAfterCurrent)
  {
    HashSet<Guid> usedAfterPick = new(selectedIds) { candidate.Id };
    decimal cashLeft = remainingCash - candidate.DraftFee;
    decimal wageLeft = remainingWage - candidate.Wage;

    if (cashLeft < MinCashToFill(catalog, usedAfterPick, slotsAfterCurrent))
    {
      return false;
    }

    if (wageLeft < MinWageToFill(catalog, usedAfterPick, slotsAfterCurrent))
    {
      return false;
    }

    return true;
  }

  private static List<BasePlayer>? BuildNearTargetShortlist(
    List<BasePlayer> affordable,
    decimal targetFee,
    decimal targetWage,
    decimal slack,
    int shortlistSize)
  {
    decimal feeMin = targetFee * (1m - slack);
    decimal feeMax = targetFee * (1m + slack);
    decimal wageMin = targetWage * (1m - slack);
    decimal wageMax = targetWage * (1m + slack);

    List<BasePlayer> inBand = affordable
      .Where(bp => bp.DraftFee >= feeMin && bp.DraftFee <= feeMax)
      .Where(bp => bp.Wage >= wageMin && bp.Wage <= wageMax)
      .OrderBy(bp => DistanceToTargets(bp, targetFee, targetWage))
      .ThenByDescending(bp => BasePlayerRatingCalculator.Calculate(bp))
      .ThenBy(bp => bp.Id)
      .Take(shortlistSize)
      .ToList();

    if (inBand.Count == 0)
    {
      return null;
    }

    return inBand;
  }

  private static decimal DistanceToTargets(
    BasePlayer player,
    decimal targetFee,
    decimal targetWage)
  {
    decimal feeScale = targetFee <= 0m ? 1m : targetFee;
    decimal wageScale = targetWage <= 0m ? 1m : targetWage;
    decimal feeDistance = Math.Abs(player.DraftFee - targetFee) / feeScale;
    decimal wageDistance = Math.Abs(player.Wage - targetWage) / wageScale;
    return feeDistance + wageDistance;
  }

  private static decimal MinCashToFill(
    IReadOnlyList<BasePlayer> catalog,
    HashSet<Guid> usedIds,
    List<PlayerPosition> slots)
  {
    HashSet<Guid> used = new(usedIds);
    decimal total = 0m;

    foreach (PlayerPosition position in slots)
    {
      BasePlayer? cheapest = catalog
        .Where(bp => bp.Position == position && !used.Contains(bp.Id))
        .OrderBy(bp => bp.DraftFee)
        .ThenBy(bp => bp.Id)
        .FirstOrDefault();

      if (cheapest == null)
      {
        return decimal.MaxValue;
      }

      total += cheapest.DraftFee;
      used.Add(cheapest.Id);
    }

    return total;
  }

  private static decimal MinWageToFill(
    IReadOnlyList<BasePlayer> catalog,
    HashSet<Guid> usedIds,
    List<PlayerPosition> slots)
  {
    HashSet<Guid> used = new(usedIds);
    decimal total = 0m;

    foreach (PlayerPosition position in slots)
    {
      BasePlayer? cheapest = catalog
        .Where(bp => bp.Position == position && !used.Contains(bp.Id))
        .OrderBy(bp => bp.Wage)
        .ThenBy(bp => bp.Id)
        .FirstOrDefault();

      if (cheapest == null)
      {
        return decimal.MaxValue;
      }

      total += cheapest.Wage;
      used.Add(cheapest.Id);
    }

    return total;
  }
}
