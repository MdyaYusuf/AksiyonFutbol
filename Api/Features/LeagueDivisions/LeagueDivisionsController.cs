using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.LeagueDivisions;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LeagueDivisionsController(ILeagueDivisionService _leagueDivisionService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    CancellationToken cancellationToken = default)
  {
    var result = await _leagueDivisionService.GetAllAsync(
      pageNumber: pagination.PageNumber,
      pageSize: pagination.PageSize,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:int}")]
  public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.GetByIdAsync(
      id: id,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("tier/{tier:int}")]
  public async Task<IActionResult> GetByTier(int tier, CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.GetByTierAsync(
      tier: tier,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("tier/{tier:int}/group/{groupNumber:int}")]
  public async Task<IActionResult> GetByTierAndGroup(
    int tier,
    int groupNumber,
    CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.GetByTierAndGroupAsync(
      tier: tier,
      groupNumber: groupNumber,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Add([FromBody] CreateLeagueDivisionRequest request, CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.AddAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Update([FromBody] UpdateLeagueDivisionRequest request, CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.UpdateAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("match-week")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateCurrentMatchWeek(
    [FromBody] UpdateLeagueDivisionMatchWeekRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.UpdateCurrentMatchWeekAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("{id:int}/advance-match-week")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> AdvanceMatchWeek(int id, CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.AdvanceMatchWeekAsync(
      id: id,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:int}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
  {
    var result = await _leagueDivisionService.RemoveAsync(
      id: id,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
