using Api.Core.Options;
using Api.Features.BasePlayers;

namespace Api.Features.ClubDrafts;

/// <summary>
/// Applies style personality to fee/wage targets and shortlist ordering.
/// </summary>
public static class BotDraftStyleEffects
{
  public static BotDraftProfileSettings ApplyProfileOverrides(
    BotDraftProfileSettings source,
    BotDraftStyle style)
  {
    if (style != BotDraftStyle.Depth)
    {
      return source;
    }

    return new BotDraftProfileSettings
    {
      TargetCashSpendRatio = source.TargetCashSpendRatio,
      TargetWageSpendRatio = source.TargetWageSpendRatio,
      MaxGold = Math.Min(source.MaxGold, 1),
      MinSilver = source.MinSilver,
      MaxIron = source.MaxIron,
      FeeBandMultiplier = source.FeeBandMultiplier,
      AllowDraftOnly = source.AllowDraftOnly
    };
  }

  public static void AdjustTargets(
    BotDraftStyle style,
    BotDraftRole role,
    PlayerPosition position,
    ref decimal targetFee,
    ref decimal targetWage,
    ref bool starHeavyBoostUsed)
  {
    if (style == BotDraftStyle.YouthCheap)
    {
      targetFee *= 1.05m;
      targetWage *= 0.85m;
      return;
    }

    if (style == BotDraftStyle.VeteranWages)
    {
      targetFee *= 0.90m;
      targetWage *= 1.15m;
      return;
    }

    if (style == BotDraftStyle.StarHeavy)
    {
      bool ambitiousRole = role == BotDraftRole.Star
        || role == BotDraftRole.Key
        || role == BotDraftRole.Engine;
      bool attackBand = position == PlayerPosition.Forward
        || position == PlayerPosition.Midfielder;

      if (!starHeavyBoostUsed && ambitiousRole && attackBand)
      {
        targetFee *= 1.35m;
        targetWage *= 1.20m;
        starHeavyBoostUsed = true;
      }

      return;
    }

    if (style == BotDraftStyle.Depth)
    {
      if (role == BotDraftRole.Star || role == BotDraftRole.Key)
      {
        targetFee *= 0.85m;
        targetWage *= 0.90m;
      }
      else if (role == BotDraftRole.Rotation || role == BotDraftRole.Cheap || role == BotDraftRole.Backup)
      {
        targetFee *= 1.10m;
        targetWage *= 1.05m;
      }
    }
  }

  public static IOrderedEnumerable<BasePlayer> OrderByStylePreference(
    IEnumerable<BasePlayer> players,
    BotDraftStyle style,
    decimal targetFee,
    decimal targetWage,
    Func<BasePlayer, decimal, decimal, decimal> distanceToTargets,
    Func<BasePlayer, int> rating)
  {
    if (style == BotDraftStyle.YouthCheap)
    {
      return players
        .OrderBy(bp => distanceToTargets(bp, targetFee, targetWage))
        .ThenBy(bp => bp.Age)
        .ThenByDescending(bp => rating(bp))
        .ThenBy(bp => bp.Id);
    }

    if (style == BotDraftStyle.VeteranWages)
    {
      return players
        .OrderBy(bp => distanceToTargets(bp, targetFee, targetWage))
        .ThenByDescending(bp => bp.Age)
        .ThenByDescending(bp => rating(bp))
        .ThenBy(bp => bp.Id);
    }

    return players
      .OrderBy(bp => distanceToTargets(bp, targetFee, targetWage))
      .ThenByDescending(bp => rating(bp))
      .ThenBy(bp => bp.Id);
  }
}
