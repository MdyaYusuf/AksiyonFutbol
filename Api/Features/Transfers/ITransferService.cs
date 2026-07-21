using Api.Core.Responses;

namespace Api.Features.Transfers;

public interface ITransferService
{
  Task<ReturnModel<List<TransferMarketItemDto>>> GetMarketAsync(
    TransferMarketQuery query,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<TransferListingResponseDto>>> GetMyListingsAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferListingResponseDto>> CreateListingAsync(
    CreateTransferListingRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferListingResponseDto>> WithdrawListingAsync(
    Guid listingId,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferDealsResponseDto>> GetMyDealsAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferOfferResponseDto>> CreateOfferAsync(
    CreateTransferOfferRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferOfferResponseDto>> WithdrawOfferAsync(
    Guid offerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferOfferResponseDto>> AcceptOfferAsync(
    Guid offerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<TransferOfferResponseDto>> RejectOfferAsync(
    Guid offerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
