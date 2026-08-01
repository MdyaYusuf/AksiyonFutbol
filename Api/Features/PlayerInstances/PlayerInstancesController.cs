using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.PlayerInstances;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlayerInstancesController(IPlayerInstanceService _playerInstanceService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    CancellationToken cancellationToken = default)
  {
    var result = await _playerInstanceService.GetAllAsync(
      currentPage: pagination.CurrentPage,
      pageSize: pagination.PageSize,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.GetByIdAsync(
      id: id,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-club/{clubId:guid}")]
  public async Task<IActionResult> GetByClubId(Guid clubId, CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.GetByClubIdAsync(
      clubId: clubId,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("my-club")]
  public async Task<IActionResult> GetCurrentUserClubPlayers(CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.GetCurrentUserClubPlayersAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-club/{clubId:guid}/available")]
  public async Task<IActionResult> GetAvailableByClubId(Guid clubId, CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.GetAvailableByClubIdAsync(
      clubId: clubId,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-club/{clubId:guid}/injured")]
  public async Task<IActionResult> GetInjuredByClubId(Guid clubId, CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.GetInjuredByClubIdAsync(
      clubId: clubId,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("from-base-player")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> AddFromBasePlayer(
    [FromBody] CreatePlayerInstanceFromBasePlayerRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.AddFromBasePlayerAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("custom")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> AddCustom(
    [FromBody] CreateCustomPlayerInstanceRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.AddCustomAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("name")]
  public async Task<IActionResult> UpdateName(
    [FromBody] UpdatePlayerInstanceNameRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.UpdateNameAsync(
      request: request,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("stats")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateStats(
    [FromBody] UpdatePlayerInstanceStatsRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.UpdateStatsAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("health")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateHealth(
    [FromBody] UpdatePlayerInstanceHealthRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.UpdateHealthAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("season-stats")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateSeasonStats(
    [FromBody] UpdatePlayerInstanceSeasonStatsRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.UpdateSeasonStatsAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    var result = await _playerInstanceService.RemoveAsync(
      id: id,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
