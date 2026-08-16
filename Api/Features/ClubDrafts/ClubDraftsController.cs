using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.ClubDrafts;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClubDraftsController(IClubDraftService _clubDraftService) : CustomBaseController
{
  [HttpGet("me/catalog")]
  public async Task<IActionResult> GetCatalog(CancellationToken cancellationToken)
  {
    var result = await _clubDraftService.GetCatalogAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("me")]
  public async Task<IActionResult> GetState(CancellationToken cancellationToken)
  {
    var result = await _clubDraftService.GetStateAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("me/picks")]
  public async Task<IActionResult> AddPick(
    [FromBody] AddClubDraftPickRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _clubDraftService.AddPickAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("me/picks/{basePlayerId:guid}")]
  public async Task<IActionResult> RemovePick(
    Guid basePlayerId,
    CancellationToken cancellationToken)
  {
    var result = await _clubDraftService.RemovePickAsync(
      basePlayerId: basePlayerId,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("me/finalize")]
  public async Task<IActionResult> Finalize(CancellationToken cancellationToken)
  {
    var result = await _clubDraftService.FinalizeAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
