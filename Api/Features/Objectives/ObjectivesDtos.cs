namespace Api.Features.Objectives;

public sealed record ObjectiveRewardDto(
  decimal CashReward,
  int LegitimacyReward,
  int InfamyReward,
  string? TitleKey,
  string? TitleDisplayName);

public sealed record ObjectiveProgressDto(
  ObjectiveKey Key,
  string DisplayName,
  string Description,
  ObjectiveCategory Category,
  ObjectiveTrackAffinity TrackAffinity,
  int CurrentValue,
  int TargetValue,
  ObjectiveStatus Status,
  ObjectiveRewardDto Reward,
  DateTime? CompletedDate,
  DateTime? ClaimedDate);

public sealed record PresidentTitleDto(
  string TitleKey,
  string DisplayName,
  TitleUnlockSource Source,
  DateTime UnlockedDate,
  bool IsEquipped);

public sealed record ObjectivesContextDto(
  Guid ClubId,
  string EquippedTitle,
  int ClaimableCount,
  IReadOnlyList<ObjectiveProgressDto> Objectives,
  IReadOnlyList<PresidentTitleDto> Titles);

public sealed record ClaimObjectiveRequest(ObjectiveKey ObjectiveKey);

public sealed record EquipTitleRequest(string TitleKey);

public sealed record ClaimObjectiveResultDto(
  ObjectiveProgressDto Objective,
  decimal NewCash,
  int NewLegitimacy,
  int NewInfamy,
  string EquippedTitle,
  IReadOnlyList<PresidentTitleDto> Titles);
