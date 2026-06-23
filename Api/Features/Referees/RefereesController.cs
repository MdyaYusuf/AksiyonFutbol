using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Referees;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RefereesController(IRefereeService _refereeService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    CancellationToken cancellationToken = default)
  {
    var result = await _refereeService.GetAllAsync(
      pageNumber: pagination.PageNumber,
      pageSize: pagination.PageSize,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:int}")]
  public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
  {
    var result = await _refereeService.GetByIdAsync(
      id: id,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("personality/{personalityType}")]
  public async Task<IActionResult> GetByPersonalityType(
    RefereePersonalityType personalityType,
    CancellationToken cancellationToken)
  {
    var result = await _refereeService.GetByPersonalityTypeAsync(
      personalityType: personalityType,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("easiest-to-bribe/{count:int}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetEasiestToBribe(int count, CancellationToken cancellationToken)
  {
    var result = await _refereeService.GetEasiestToBribeAsync(
      count: count,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Add([FromBody] CreateRefereeRequest request, CancellationToken cancellationToken)
  {
    var result = await _refereeService.AddAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Update([FromBody] UpdateRefereeRequest request, CancellationToken cancellationToken)
  {
    var result = await _refereeService.UpdateAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:int}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
  {
    var result = await _refereeService.RemoveAsync(
      id: id,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
