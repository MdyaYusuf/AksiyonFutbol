using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;

namespace Api.Features.Transfers;

public class TransferOffer : Entity<Guid>
{
  [SetsRequiredMembers]
  public TransferOffer()
  {
    Status = TransferOfferStatus.Pending;
  }

  public decimal OfferFee { get; set; }
  public decimal ProposedWage { get; set; }
  public TransferOfferStatus Status { get; set; }

  public Guid TransferListingId { get; set; }
  public Guid BuyingClubId { get; set; }

  public virtual TransferListing TransferListing { get; set; } = default!;
  public virtual Club BuyingClub { get; set; } = default!;
}
