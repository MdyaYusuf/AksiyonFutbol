using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Bribery;

[Authorize]
[ApiController]
[Route("api/bribery")]
public class BriberyController(IBriberyService _briberyService) : CustomBaseController
{
  [HttpGet("context")]
  public async Task<IActionResult> GetContext(CancellationToken cancellationToken)
  {
    var result = await _briberyService.GetContextForCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("attempts")]
  public async Task<IActionResult> CreateAttempt(
    [FromBody] CreateBribeAttemptRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _briberyService.CreateAttemptForCurrentUserAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("attempts/me")]
  public async Task<IActionResult> GetMyAttempts(CancellationToken cancellationToken)
  {
    var result = await _briberyService.GetMyAttemptsAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
