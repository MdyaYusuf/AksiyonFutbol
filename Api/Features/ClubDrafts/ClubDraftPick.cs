using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.BasePlayers;
using Api.Features.Clubs;

namespace Api.Features.ClubDrafts;

public class ClubDraftPick : Entity<Guid>
{
  [SetsRequiredMembers]
  public ClubDraftPick()
  {
    Club = default!;
    BasePlayer = default!;
  }

  public Guid ClubId { get; set; }
  public Guid BasePlayerId { get; set; }
  public int PickOrder { get; set; }

  public virtual Club Club { get; set; }
  public virtual BasePlayer BasePlayer { get; set; }
}
