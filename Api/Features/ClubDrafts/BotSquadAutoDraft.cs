using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.Clubs;

namespace Api.Features.ClubDrafts;

/// <summary>
/// Shared bot open-pool draft used by tutorial finalize and competitive seating.
/// Mutates <paramref name="pool"/> by removing selected templates.
/// </summary>
public static class BotSquadAutoDraft
{
  public static List<BasePlayer> SelectSquad(
    List<BasePlayer> pool,
    GameOptions options,
    decimal cash,
    decimal wageBudget)
  {
    ClubDraftBusinessRules.EnsureCompositionIsValid(options);

    List<BasePlayer> selected = [];
    decimal remainingCash = cash;
    decimal remainingWage = wageBudget;

    foreach ((PlayerPosition position, int required) in ClubDraftBusinessRules.GetQuotaMap(options))
    {
      for (int i = 0; i < required; i++)
      {
        BasePlayer? pick = SelectPick(pool, selected, position, remainingCash, remainingWage, options);

        if (pick == null)
        {
          throw new BusinessException(
            $"Bot draft için yeterli {position} adayı kalmadı. Katalog veya bütçe yetersiz.");
        }

        selected.Add(pick);
        remainingCash -= pick.DraftFee;
        remainingWage -= ClubDraftBusinessRules.EstimateWage(pick, options);
      }
    }

    foreach (BasePlayer pick in selected)
    {
      pool.Remove(pick);
    }

    return selected;
  }

  private static BasePlayer? SelectPick(
    List<BasePlayer> pool,
    List<BasePlayer> alreadySelected,
    PlayerPosition position,
    decimal remainingCash,
    decimal remainingWage,
    GameOptions options)
  {
    HashSet<Guid> selectedIds = alreadySelected.Select(p => p.Id).ToHashSet();

    List<BasePlayer> candidates = pool
      .Where(bp => !selectedIds.Contains(bp.Id))
      .Where(bp => bp.Position == position)
      .Where(bp => bp.DraftFee <= remainingCash)
      .Where(bp => ClubDraftBusinessRules.EstimateWage(bp, options) <= remainingWage)
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
}
