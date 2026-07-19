using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.ClubLineups;

[Authorize]
[ApiController]
[Route("api/clubLineups")]
public class ClubLineupsController(IClubLineupService _clubLineupService) : CustomBaseController
{
  [HttpGet("me")]
  public async Task<IActionResult> GetCurrentUserLineup(CancellationToken cancellationToken)
  {
    var result = await _clubLineupService.GetForCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("me")]
  public async Task<IActionResult> UpsertCurrentUserLineup(
    [FromBody] UpsertClubLineupRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _clubLineupService.UpsertForCurrentUserAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-club/{clubId:guid}")]
  public async Task<IActionResult> GetByClubId(Guid clubId, CancellationToken cancellationToken)
  {
    var result = await _clubLineupService.GetByClubIdAsync(
      clubId: clubId,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("by-club/{clubId:guid}")]
  public async Task<IActionResult> UpsertByClubId(
    Guid clubId,
    [FromBody] UpsertClubLineupRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _clubLineupService.UpsertByClubIdAsync(
      clubId: clubId,
      request: request,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
