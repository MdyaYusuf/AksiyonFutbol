using Api.Core.Options;
using Api.Features.LeagueDivisions;

namespace Api.Features.CompetitiveSeating;

public static class TutorialGraduationBusinessRules
{
  public static LeagueTier ResolvePlacementTier(int points, GameOptions options)
  {
    if (points >= options.GraduationGoldMinPoints && points <= options.GraduationGoldMaxPoints)
    {
      return LeagueTier.Gold;
    }

    if (points >= options.GraduationSilverMinPoints && points <= options.GraduationSilverMaxPoints)
    {
      return LeagueTier.Silver;
    }

    if (points >= options.GraduationBronzeMinPoints && points <= options.GraduationBronzeMaxPoints)
    {
      return LeagueTier.Bronze;
    }

    if (points >= options.GraduationIronMinPoints && points <= options.GraduationIronMaxPoints)
    {
      return LeagueTier.Iron;
    }

    // Clamp outliers (e.g. misconfigured bands) to nearest edge.
    if (points > options.GraduationGoldMaxPoints)
    {
      return LeagueTier.Gold;
    }

    return LeagueTier.Iron;
  }

  public static decimal GetSeatingBonus(LeagueTier tier, GameOptions options)
  {
    return tier switch
    {
      LeagueTier.Gold => options.SeatingBonusGold,
      LeagueTier.Silver => options.SeatingBonusSilver,
      LeagueTier.Bronze => options.SeatingBonusBronze,
      LeagueTier.Iron => options.SeatingBonusIron,
      _ => options.SeatingBonusIron
    };
  }

  public static decimal GetTierStartingWageBudget(LeagueTier tier, GameOptions options)
  {
    return tier switch
    {
      LeagueTier.Gold => options.TierStartingWageBudgetGold,
      LeagueTier.Silver => options.TierStartingWageBudgetSilver,
      LeagueTier.Bronze => options.TierStartingWageBudgetBronze,
      LeagueTier.Iron => options.TierStartingWageBudgetIron,
      _ => options.TierStartingWageBudgetIron
    };
  }
}
