using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Transfers;

public class EfTransferListingRepository : EfBaseRepository<BaseDbContext, TransferListing, Guid>, ITransferListingRepository
{
  public EfTransferListingRepository(BaseDbContext context) : base(context)
  {
  }
}
