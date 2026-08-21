namespace Api.Features.ClubDrafts;

/// <summary>
/// Squad-slot ambition for bot auto-draft. Mapped to fee/wage band multipliers.
/// </summary>
public enum BotDraftRole
{
  Star = 1,
  Key = 2,
  Starter = 3,
  Engine = 4,
  Support = 5,
  Rotation = 6,
  Cheap = 7,
  Backup = 8
}
