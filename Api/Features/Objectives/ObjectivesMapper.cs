namespace Api.Features.Objectives;

public class ObjectivesMapper
{
  public ObjectiveProgressDto ToProgressDto(
    ObjectiveDefinition definition,
    ClubObjectiveProgress progress)
  {
    return new ObjectiveProgressDto(
      Key: definition.Key,
      Metric: definition.Metric,
      DisplayName: definition.DisplayName,
      Description: definition.Description,
      Category: definition.Category,
      TrackAffinity: definition.TrackAffinity,
      CurrentValue: progress.CurrentValue,
      TargetValue: progress.TargetValue,
      Status: progress.Status,
      Reward: new ObjectiveRewardDto(
        definition.CashReward,
        definition.LegitimacyReward,
        definition.InfamyReward,
        definition.TitleKey,
        definition.TitleDisplayName),
      CompletedDate: progress.CompletedDate,
      ClaimedDate: progress.ClaimedDate);
  }

  public PresidentTitleDto ToTitleDto(PresidentTitleUnlock unlock, string? equippedTitle)
  {
    string equippedKey = string.IsNullOrWhiteSpace(equippedTitle)
      ? string.Empty
      : ObjectivesBusinessRules.ToTitleKey(equippedTitle);

    return new PresidentTitleDto(
      TitleKey: unlock.TitleKey,
      DisplayName: unlock.DisplayName,
      Source: unlock.Source,
      UnlockedDate: unlock.UnlockedDate,
      IsEquipped: unlock.TitleKey == equippedKey);
  }
}
