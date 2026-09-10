using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.ClubPresidents;

namespace Api.Features.Objectives;

public class PresidentTitleUnlock : Entity<Guid>
{
  [SetsRequiredMembers]
  public PresidentTitleUnlock()
  {
    TitleKey = default!;
    DisplayName = default!;
  }

  public Guid PresidentId { get; set; }
  public required string TitleKey { get; set; }
  public required string DisplayName { get; set; }
  public TitleUnlockSource Source { get; set; }
  public DateTime UnlockedDate { get; set; }

  public virtual ClubPresident President { get; set; } = default!;
}
