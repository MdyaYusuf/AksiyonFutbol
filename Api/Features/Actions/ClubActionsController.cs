using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Actions;

[Authorize]
[ApiController]
[Route("api/actions")]
public class ClubActionsController(IClubActionService _clubActionService) : CustomBaseController
{
  [HttpGet("context")]
  public async Task<IActionResult> GetContext(CancellationToken cancellationToken)
  {
    var result = await _clubActionService.GetContextForCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("execute")]
  public async Task<IActionResult> Execute(
    [FromBody] ExecuteClubActionRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _clubActionService.ExecuteForCurrentUserAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("history/me")]
  public async Task<IActionResult> GetMyHistory(CancellationToken cancellationToken)
  {
    var result = await _clubActionService.GetMyHistoryAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
