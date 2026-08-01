using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.ClubPresidents;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClubPresidentsController(IClubPresidentService _clubPresidentService) : CustomBaseController
{
  [HttpGet]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    CancellationToken cancellationToken = default)
  {
    var result = await _clubPresidentService.GetAllAsync(
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      currentPage: pagination.CurrentPage,
      pageSize: pagination.PageSize,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.GetByIdAsync(
      id: id,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-user/{userId:guid}")]
  public async Task<IActionResult> GetByUserId(Guid userId, CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.GetAsync(
      predicate: cp => cp.UserId == userId,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("me")]
  public async Task<IActionResult> GetCurrentUserPresident(CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.GetByCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("me/exists")]
  public async Task<IActionResult> CheckCurrentUserHasPresident(CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.CheckCurrentUserHasPresidentAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  public async Task<IActionResult> Add([FromBody] CreateClubPresidentRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.AddAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  public async Task<IActionResult> Update([FromBody] UpdateClubPresidentRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.UpdateAsync(
      request: request,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("reputation")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateReputation(
    [FromBody] UpdateClubPresidentReputationRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.UpdateReputationAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    var result = await _clubPresidentService.RemoveAsync(
      id: id,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
