using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Transfers;

public class EfTransferOfferRepository : EfBaseRepository<BaseDbContext, TransferOffer, Guid>, ITransferOfferRepository
{
  public EfTransferOfferRepository(BaseDbContext context) : base(context)
  {
  }
}
