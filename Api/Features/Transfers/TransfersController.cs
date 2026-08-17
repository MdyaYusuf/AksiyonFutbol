using Api.Core.Controllers;
using Api.Features.BasePlayers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Transfers;

[Authorize]
[ApiController]
[Route("api/transfers")]
public class TransfersController(ITransferService _transferService) : CustomBaseController
{
  [HttpGet("market")]
  public async Task<IActionResult> GetMarket(
    [FromQuery] PlayerPosition? position,
    [FromQuery] string? search,
    [FromQuery] string? sortBy,
    [FromQuery] bool sortDescending = true,
    CancellationToken cancellationToken = default)
  {
    var result = await _transferService.GetMarketAsync(
      query: new TransferMarketQuery
      {
        Position = position,
        Search = search,
        SortBy = sortBy,
        SortDescending = sortDescending
      },
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("listings/me")]
  public async Task<IActionResult> GetMyListings(CancellationToken cancellationToken)
  {
    var result = await _transferService.GetMyListingsAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("listings")]
  public async Task<IActionResult> CreateListing(
    [FromBody] CreateTransferListingRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.CreateListingAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("listings/{listingId:guid}/withdraw")]
  public async Task<IActionResult> WithdrawListing(
    Guid listingId,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.WithdrawListingAsync(
      listingId: listingId,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("deals/me")]
  public async Task<IActionResult> GetMyDeals(CancellationToken cancellationToken)
  {
    var result = await _transferService.GetMyDealsAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("offers")]
  public async Task<IActionResult> CreateOffer(
    [FromBody] CreateTransferOfferRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.CreateOfferAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("offers/{offerId:guid}/withdraw")]
  public async Task<IActionResult> WithdrawOffer(
    Guid offerId,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.WithdrawOfferAsync(
      offerId: offerId,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("offers/{offerId:guid}/accept")]
  public async Task<IActionResult> AcceptOffer(
    Guid offerId,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.AcceptOfferAsync(
      offerId: offerId,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("offers/{offerId:guid}/reject")]
  public async Task<IActionResult> RejectOffer(
    Guid offerId,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.RejectOfferAsync(
      offerId: offerId,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("free-agents")]
  public async Task<IActionResult> GetFreeAgents(
    [FromQuery] PlayerPosition? position,
    [FromQuery] DraftTier? tier,
    [FromQuery] string? search,
    [FromQuery] string? sortBy,
    [FromQuery] bool sortDescending = true,
    CancellationToken cancellationToken = default)
  {
    var result = await _transferService.GetFreeAgentsAsync(
      query: new FreeAgentMarketQuery
      {
        Position = position,
        Tier = tier,
        Search = search,
        SortBy = sortBy,
        SortDescending = sortDescending
      },
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("free-agents/{basePlayerId:guid}/sign")]
  public async Task<IActionResult> SignFreeAgent(
    Guid basePlayerId,
    CancellationToken cancellationToken)
  {
    var result = await _transferService.SignFreeAgentAsync(
      basePlayerId: basePlayerId,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
