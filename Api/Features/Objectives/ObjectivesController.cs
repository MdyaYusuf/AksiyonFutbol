using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Objectives;

[Authorize]
[ApiController]
[Route("api/objectives")]
public class ObjectivesController(IObjectivesService _objectivesService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetContext(CancellationToken cancellationToken)
  {
    var result = await _objectivesService.GetContextForCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("claim")]
  public async Task<IActionResult> Claim(
    [FromBody] ClaimObjectiveRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _objectivesService.ClaimForCurrentUserAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("titles/equip")]
  public async Task<IActionResult> EquipTitle(
    [FromBody] EquipTitleRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _objectivesService.EquipTitleForCurrentUserAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
