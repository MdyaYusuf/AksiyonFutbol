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

    List<PlayerPosition> remainingSlots = BuildSlotQueue(options);
    List<BasePlayer> selected = [];
    decimal remainingCash = cash;
    decimal remainingWage = wageBudget;

    while (remainingSlots.Count > 0)
    {
      PlayerPosition position = remainingSlots[0];
      List<PlayerPosition> slotsAfterCurrent = remainingSlots.Skip(1).ToList();

      BasePlayer? pick = SelectPick(
        catalog,
        selected,
        position,
        remainingCash,
        remainingWage,
        slotsAfterCurrent);

      if (pick == null)
      {
        throw new BusinessException(
          $"Bot draft için yeterli {position} adayı kalmadı. Katalog veya bütçe yetersiz.");
      }

      selected.Add(pick);
      remainingCash -= pick.DraftFee;
      remainingWage -= pick.Wage;
      remainingSlots.RemoveAt(0);
    }

    return selected;
  }

  private static List<PlayerPosition> BuildSlotQueue(GameOptions options)
  {
    List<PlayerPosition> slots = [];

    foreach ((PlayerPosition position, int required) in ClubDraftBusinessRules.GetQuotaMap(options))
    {
      for (int i = 0; i < required; i++)
      {
        slots.Add(position);
      }
    }

    return slots;
  }

  private static BasePlayer? SelectPick(
    IReadOnlyList<BasePlayer> catalog,
    List<BasePlayer> alreadySelected,
    PlayerPosition position,
    decimal remainingCash,
    decimal remainingWage,
    List<PlayerPosition> slotsAfterCurrent)
  {
    HashSet<Guid> selectedIds = alreadySelected.Select(p => p.Id).ToHashSet();

    List<BasePlayer> candidates = catalog
      .Where(bp => !selectedIds.Contains(bp.Id))
      .Where(bp => bp.Position == position)
      .Where(bp => bp.DraftFee <= remainingCash)
      .Where(bp => bp.Wage <= remainingWage)
      .Where(bp =>
      {
        HashSet<Guid> usedAfterPick = new(selectedIds) { bp.Id };
        decimal cashLeft = remainingCash - bp.DraftFee;
        decimal wageLeft = remainingWage - bp.Wage;

        if (cashLeft < MinCashToFill(catalog, usedAfterPick, slotsAfterCurrent))
        {
          return false;
        }

        if (wageLeft < MinWageToFill(catalog, usedAfterPick, slotsAfterCurrent))
        {
          return false;
        }

        return true;
      })
      .OrderBy(bp => bp.DraftFee)
      .ThenByDescending(bp => BasePlayerRatingCalculator.Calculate(bp))
      .ThenBy(bp => bp.Id)
      .Take(3)
      .ToList();

    if (candidates.Count == 0)
    {
      return null;
    }

    return candidates[Random.Shared.Next(candidates.Count)];
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
