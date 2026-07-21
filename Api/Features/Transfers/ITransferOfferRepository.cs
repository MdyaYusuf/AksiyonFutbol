using Api.Core.Repositories;

namespace Api.Features.Transfers;

public interface ITransferOfferRepository : IRepository<TransferOffer, Guid>
{
}
