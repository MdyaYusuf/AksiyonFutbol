using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Facilities;

[Authorize]
[ApiController]
[Route("api/facilities")]
public class FacilitiesController(IFacilitiesService _facilitiesService) : CustomBaseController
{
  [HttpGet("me")]
  public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
  {
    var result = await _facilitiesService.GetForCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("upgrade")]
  public async Task<IActionResult> Upgrade(
    [FromBody] UpgradeFacilityRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _facilitiesService.UpgradeForCurrentUserAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
