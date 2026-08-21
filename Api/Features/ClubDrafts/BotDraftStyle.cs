namespace Api.Features.ClubDrafts;

/// <summary>
/// Personality lean for bot auto-draft. Step 1 accepts this; later steps apply modifiers.
/// </summary>
public enum BotDraftStyle
{
  Balanced = 1,
  YouthCheap = 2,
  VeteranWages = 3,
  StarHeavy = 4,
  Depth = 5
}
