using Api.Core.Repositories;

namespace Api.Features.Transfers;

public interface ITransferListingRepository : IRepository<TransferListing, Guid>
{
}
