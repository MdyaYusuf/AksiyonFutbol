using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;

namespace Api.Features.Transfers;

public class TransferListing : Entity<Guid>
{
  [SetsRequiredMembers]
  public TransferListing()
  {
    Offers = new HashSet<TransferOffer>();
    Status = TransferListingStatus.Active;
  }

  public decimal AskingPrice { get; set; }
  public TransferListingStatus Status { get; set; }

  public Guid PlayerInstanceId { get; set; }
  public Guid ClubId { get; set; }

  public virtual PlayerInstance PlayerInstance { get; set; } = default!;
  public virtual Club Club { get; set; } = default!;
  public virtual ICollection<TransferOffer> Offers { get; set; }
}
