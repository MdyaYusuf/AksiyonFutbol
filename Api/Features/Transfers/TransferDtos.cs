using Api.Features.BasePlayers;

namespace Api.Features.Transfers;

public sealed record CreateTransferListingRequest(
  Guid PlayerInstanceId,
  decimal AskingPrice);

public sealed record CreateTransferOfferRequest(
  Guid TransferListingId,
  decimal OfferFee,
  decimal ProposedWage);

public sealed class TransferMarketItemDto
{
  public Guid ListingId { get; init; }
  public Guid PlayerInstanceId { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string Position { get; init; } = default!;
  public int Age { get; init; }
  public int OverallRating { get; init; }
  public decimal MarketValue { get; init; }
  public decimal Wage { get; init; }
  public bool IsInjured { get; init; }
  public decimal AskingPrice { get; init; }
  public Guid SellingClubId { get; init; }
  public string SellingClubName { get; init; } = default!;
  public DateTime ListedAt { get; init; }
}

public sealed class TransferListingResponseDto
{
  public Guid Id { get; init; }
  public Guid PlayerInstanceId { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string Position { get; init; } = default!;
  public int OverallRating { get; init; }
  public decimal MarketValue { get; init; }
  public decimal AskingPrice { get; init; }
  public TransferListingStatus Status { get; init; }
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public int PendingOfferCount { get; init; }
  public DateTime CreatedDate { get; init; }
  public DateTime? UpdatedDate { get; init; }
}

public sealed class TransferOfferResponseDto
{
  public Guid Id { get; init; }
  public Guid TransferListingId { get; init; }
  public Guid PlayerInstanceId { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string Position { get; init; } = default!;
  public int OverallRating { get; init; }
  public decimal AskingPrice { get; init; }
  public decimal OfferFee { get; init; }
  public decimal ProposedWage { get; init; }
  public TransferOfferStatus Status { get; init; }
  public Guid SellingClubId { get; init; }
  public string SellingClubName { get; init; } = default!;
  public Guid BuyingClubId { get; init; }
  public string BuyingClubName { get; init; } = default!;
  public DateTime CreatedDate { get; init; }
  public DateTime? UpdatedDate { get; init; }
}

public sealed class TransferDealsResponseDto
{
  public List<TransferOfferResponseDto> IncomingOffers { get; init; } = [];
  public List<TransferOfferResponseDto> OutgoingOffers { get; init; } = [];
}

public sealed class TransferMarketQuery
{
  public PlayerPosition? Position { get; init; }
  public string? Search { get; init; }
  public string? SortBy { get; init; }
  public bool SortDescending { get; init; } = true;
}

public sealed class FreeAgentMarketItemDto
{
  public Guid BasePlayerId { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string Position { get; init; } = default!;
  public int Age { get; init; }
  public int OverallRating { get; init; }
  public DraftTier DraftTier { get; init; }
  public decimal SigningFee { get; init; }
  public decimal EstimatedWage { get; init; }
  public decimal EstimatedMarketValue { get; init; }
}

public sealed class FreeAgentMarketQuery
{
  public PlayerPosition? Position { get; init; }
  public DraftTier? Tier { get; init; }
  public string? Search { get; init; }
  public string? SortBy { get; init; }
  public bool SortDescending { get; init; } = true;
}

public sealed class SignFreeAgentResponseDto
{
  public Guid PlayerInstanceId { get; init; }
  public Guid BasePlayerId { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string Position { get; init; } = default!;
  public int OverallRating { get; init; }
  public decimal SigningFeePaid { get; init; }
  public decimal Wage { get; init; }
  public decimal RemainingCash { get; init; }
}
