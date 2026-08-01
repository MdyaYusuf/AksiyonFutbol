using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.BasePlayers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BasePlayersController(IBasePlayerService _basePlayerService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    CancellationToken cancellationToken = default)
  {
    var result = await _basePlayerService.GetAllAsync(
      currentPage: pagination.CurrentPage,
      pageSize: pagination.PageSize,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
  {
    var result = await _basePlayerService.GetByIdAsync(
      id: id,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("position/{position}")]
  public async Task<IActionResult> GetByPosition(PlayerPosition position, CancellationToken cancellationToken)
  {
    var result = await _basePlayerService.GetByPositionAsync(
      position: position,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Add([FromBody] CreateBasePlayerRequest request, CancellationToken cancellationToken)
  {
    var result = await _basePlayerService.AddAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Update([FromBody] UpdateBasePlayerRequest request, CancellationToken cancellationToken)
  {
    var result = await _basePlayerService.UpdateAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    var result = await _basePlayerService.RemoveAsync(
      id: id,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
