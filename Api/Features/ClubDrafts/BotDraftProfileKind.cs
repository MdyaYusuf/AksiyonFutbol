namespace Api.Features.ClubDrafts;

/// <summary>
/// Strength band for bot auto-draft. Step 1 accepts this; later steps apply spend/tier policy.
/// </summary>
public enum BotDraftProfileKind
{
  TutorialWeak = 1,
  TutorialMid = 2,
  TutorialStrong = 3,
  Iron = 4,
  Bronze = 5,
  Silver = 6,
  Gold = 7
}
