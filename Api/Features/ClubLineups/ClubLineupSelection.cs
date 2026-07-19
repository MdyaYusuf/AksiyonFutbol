using Api.Core.Entities;
using Api.Features.PlayerInstances;

namespace Api.Features.ClubLineups;

public class ClubLineupSelection : Entity<Guid>
{
  public bool IsStarter { get; set; }
  public int SortOrder { get; set; }

  public Guid ClubLineupId { get; set; }
  public Guid PlayerInstanceId { get; set; }
  public virtual ClubLineup ClubLineup { get; set; } = default!;
  public virtual PlayerInstance PlayerInstance { get; set; } = default!;
}
