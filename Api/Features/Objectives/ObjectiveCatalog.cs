namespace Api.Features.Objectives;

public sealed class ObjectiveDefinition
{
  public required ObjectiveKey Key { get; init; }
  public required string DisplayName { get; init; }
  public required string Description { get; init; }
  public required ObjectiveCategory Category { get; init; }
  public required ObjectiveTrackAffinity TrackAffinity { get; init; }
  public required int TargetValue { get; init; }
  public decimal CashReward { get; init; }
  public int LegitimacyReward { get; init; }
  public int InfamyReward { get; init; }
  public string? TitleKey { get; init; }
  public string? TitleDisplayName { get; init; }
}

public static class ObjectiveCatalog
{
  private static readonly IReadOnlyList<ObjectiveDefinition> Definitions =
  [
    new()
    {
      Key = ObjectiveKey.WinMatches5,
      DisplayName = "First Wins",
      Description = "Win 5 matches with your club.",
      Category = ObjectiveCategory.Match,
      TrackAffinity = ObjectiveTrackAffinity.Any,
      TargetValue = 5,
      CashReward = 15_000m
    },
    new()
    {
      Key = ObjectiveKey.ScoreGoals10,
      DisplayName = "Goal Rush",
      Description = "Score 10 goals with your club.",
      Category = ObjectiveCategory.Match,
      TrackAffinity = ObjectiveTrackAffinity.Any,
      TargetValue = 10,
      CashReward = 12_000m
    },
    new()
    {
      Key = ObjectiveKey.CleanSheets3,
      DisplayName = "Shutout Specialist",
      Description = "Keep 3 clean sheets.",
      Category = ObjectiveCategory.Match,
      TrackAffinity = ObjectiveTrackAffinity.Any,
      TargetValue = 3,
      LegitimacyReward = 3
    },
    new()
    {
      Key = ObjectiveKey.IntegrityActions3,
      DisplayName = "Clean Hands",
      Description = "Successfully complete 3 Integrity-path actions.",
      Category = ObjectiveCategory.Actions,
      TrackAffinity = ObjectiveTrackAffinity.Honorable,
      TargetValue = 3,
      CashReward = 10_000m,
      LegitimacyReward = 4
    },
    new()
    {
      Key = ObjectiveKey.GrayActions3,
      DisplayName = "Under the Table",
      Description = "Successfully complete 3 Gray Area actions.",
      Category = ObjectiveCategory.Actions,
      TrackAffinity = ObjectiveTrackAffinity.Shady,
      TargetValue = 3,
      CashReward = 10_000m,
      InfamyReward = 4
    },
    new()
    {
      Key = ObjectiveKey.ReachHonorablePower,
      DisplayName = "Honorable Mandate",
      Description = "Reach Honorable Power by raising Legitimacy to 40.",
      Category = ObjectiveCategory.Identity,
      TrackAffinity = ObjectiveTrackAffinity.Honorable,
      TargetValue = 1,
      TitleKey = "honorable_power",
      TitleDisplayName = "Honorable Power"
    },
    new()
    {
      Key = ObjectiveKey.ReachGrayTierII,
      DisplayName = "Shadow Network",
      Description = "Unlock Gray Tier II by raising Infamy to 40.",
      Category = ObjectiveCategory.Identity,
      TrackAffinity = ObjectiveTrackAffinity.Shady,
      TargetValue = 1,
      TitleKey = "gray_tier_ii",
      TitleDisplayName = "Gray Operator"
    },
    new()
    {
      Key = ObjectiveKey.FacilityUpgrade1,
      DisplayName = "Grounds Investment",
      Description = "Complete one facility upgrade.",
      Category = ObjectiveCategory.Club,
      TrackAffinity = ObjectiveTrackAffinity.Any,
      TargetValue = 1,
      CashReward = 8_000m
    },
    new()
    {
      Key = ObjectiveKey.SeasonHonorablePackage,
      DisplayName = "Clean Season",
      Description = "Finish a season or placement on the Honorable identity track.",
      Category = ObjectiveCategory.Identity,
      TrackAffinity = ObjectiveTrackAffinity.Honorable,
      TargetValue = 1,
      CashReward = 20_000m
    },
    new()
    {
      Key = ObjectiveKey.SeasonShadyPackage,
      DisplayName = "Shadow Season",
      Description = "Finish a season or placement on the Shady identity track.",
      Category = ObjectiveCategory.Identity,
      TrackAffinity = ObjectiveTrackAffinity.Shady,
      TargetValue = 1,
      CashReward = 20_000m
    }
  ];

  public static IReadOnlyList<ObjectiveDefinition> All() => Definitions;

  public static ObjectiveDefinition Get(ObjectiveKey key)
  {
    ObjectiveDefinition? definition = Definitions.FirstOrDefault(d => d.Key == key);

    if (definition == null)
    {
      throw new InvalidOperationException($"Unknown objective key: {key}");
    }

    return definition;
  }

  public static bool TryGet(ObjectiveKey key, out ObjectiveDefinition definition)
  {
    ObjectiveDefinition? found = Definitions.FirstOrDefault(d => d.Key == key);
    if (found == null)
    {
      definition = null!;
      return false;
    }

    definition = found;
    return true;
  }
}
