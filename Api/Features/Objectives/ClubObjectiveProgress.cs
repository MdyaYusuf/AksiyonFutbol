using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;

namespace Api.Features.Objectives;

public class ClubObjectiveProgress : Entity<Guid>
{
  [SetsRequiredMembers]
  public ClubObjectiveProgress()
  {
    Status = ObjectiveStatus.Active;
  }

  public Guid ClubId { get; set; }
  public ObjectiveKey ObjectiveKey { get; set; }
  public int CurrentValue { get; set; }
  public int TargetValue { get; set; }
  public ObjectiveStatus Status { get; set; }
  public DateTime? CompletedDate { get; set; }
  public DateTime? ClaimedDate { get; set; }

  public virtual Club Club { get; set; } = default!;
}
