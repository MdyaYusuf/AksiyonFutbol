using Api.Core.Options;
using Api.Features.LeagueDivisions;
using Api.Features.SeasonTransitions;

namespace Api.Features.ClubPresidents;

public static class PresidentSeasonIdentityBusinessRules
{
  public static PresidentIdentityTrack ResolveTrack(int legitimacy, int infamy, int dominanceThreshold)
  {
    if (legitimacy >= infamy + dominanceThreshold)
    {
      return PresidentIdentityTrack.Honorable;
    }

    if (infamy >= legitimacy + dominanceThreshold)
    {
      return PresidentIdentityTrack.Shady;
    }

    return PresidentIdentityTrack.Neutral;
  }

  public static SeasonPresidentPackageDto BuildSeasonPackage(
    GameOptions options,
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition)
  {
    PresidentIdentityTrack track = ResolveTrack(
      president.ReputationPoints,
      president.InfamyPoints,
      options.PresidentMoralityDominanceThreshold);

    decimal cash = track switch
    {
      PresidentIdentityTrack.Honorable => options.SeasonHonorableCashReward,
      PresidentIdentityTrack.Shady => options.SeasonShadyCashReward,
      _ => options.SeasonNeutralCashReward
    };

    if (outcome == SeasonMovementOutcome.Promoted)
    {
      cash += options.SeasonPromotionCashBonus;
    }
    else if (outcome == SeasonMovementOutcome.Relegated)
    {
      cash = Math.Max(0m, cash - options.SeasonRelegationCashPenalty);
    }

    string flavorTitle = ResolveSeasonFlavorTitle(track, outcome, finishingPosition);
    string summary = ResolveSeasonPackageSummary(track, cash, outcome);

    return new SeasonPresidentPackageDto
    {
      IdentityTrack = track.ToString(),
      CashAwarded = cash,
      FlavorTitle = flavorTitle,
      Summary = summary
    };
  }

  public static SeasonPresidentPackageDto BuildTutorialGraduationPackage(
    GameOptions options,
    ClubPresident president,
    LeagueTier tier)
  {
    PresidentIdentityTrack track = ResolveTrack(
      president.ReputationPoints,
      president.InfamyPoints,
      options.PresidentMoralityDominanceThreshold);

    decimal cash = track switch
    {
      PresidentIdentityTrack.Honorable => options.TutorialGraduationHonorableCash,
      PresidentIdentityTrack.Shady => options.TutorialGraduationShadyCash,
      _ => options.TutorialGraduationNeutralCash
    };

    decimal tierBonus = tier switch
    {
      LeagueTier.Gold => options.TutorialGraduationGoldCashBonus,
      LeagueTier.Silver => options.TutorialGraduationSilverCashBonus,
      LeagueTier.Bronze => options.TutorialGraduationBronzeCashBonus,
      _ => options.TutorialGraduationIronCashBonus
    };

    cash += tierBonus;

    string flavorTitle = ResolveTutorialFlavorTitle(track, tier);
    string summary = $"Tutorial complete. {ResolveTrackLabel(track)} path package: {cash:N0} cash.";

    return new SeasonPresidentPackageDto
    {
      IdentityTrack = track.ToString(),
      CashAwarded = cash,
      FlavorTitle = flavorTitle,
      Summary = summary
    };
  }

  public static string ResolveSeasonFlavorTitle(
    PresidentIdentityTrack track,
    SeasonMovementOutcome outcome,
    int finishingPosition)
  {
    if (finishingPosition == 1)
    {
      return track switch
      {
        PresidentIdentityTrack.Honorable => "Patron of the Game",
        PresidentIdentityTrack.Shady => "Kingmaker",
        _ => "Season Champion"
      };
    }

    if (outcome == SeasonMovementOutcome.Promoted)
    {
      return track switch
      {
        PresidentIdentityTrack.Honorable => "Boardroom Favorite",
        PresidentIdentityTrack.Shady => "Fixer on the Rise",
        _ => "Promotion Architect"
      };
    }

    if (outcome == SeasonMovementOutcome.Relegated)
    {
      return track switch
      {
        PresidentIdentityTrack.Honorable => "Fallen Statesman",
        PresidentIdentityTrack.Shady => "Burned Operator",
        _ => "Survival Specialist"
      };
    }

    return track switch
    {
      PresidentIdentityTrack.Honorable => "Community Steward",
      PresidentIdentityTrack.Shady => "Shadow Broker",
      _ => "Club President"
    };
  }

  private static string ResolveTutorialFlavorTitle(
    PresidentIdentityTrack track,
    LeagueTier tier)
  {
    string tierLabel = tier switch
    {
      LeagueTier.Gold => "Gold Graduate",
      LeagueTier.Silver => "Silver Graduate",
      LeagueTier.Bronze => "Bronze Graduate",
      _ => "Iron Graduate"
    };

    return track switch
    {
      PresidentIdentityTrack.Honorable => $"Honorable {tierLabel}",
      PresidentIdentityTrack.Shady => $"Notorious {tierLabel}",
      _ => tierLabel
    };
  }

  private static string ResolveSeasonPackageSummary(
    PresidentIdentityTrack track,
    decimal cash,
    SeasonMovementOutcome outcome)
  {
    string path = ResolveTrackLabel(track);
    string movement = outcome switch
    {
      SeasonMovementOutcome.Promoted => "Promotion bonus included.",
      SeasonMovementOutcome.Relegated => "Relegation penalty applied.",
      _ => "Mid-table settlement."
    };

    return $"{path} season package: {cash:N0} cash. {movement}";
  }

  private static string ResolveTrackLabel(PresidentIdentityTrack track)
  {
    return track switch
    {
      PresidentIdentityTrack.Honorable => "Honorable",
      PresidentIdentityTrack.Shady => "Shady",
      _ => "Balanced"
    };
  }
}
