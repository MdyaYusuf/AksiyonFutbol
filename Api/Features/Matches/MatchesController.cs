using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Matches;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MatchesController(IMatchService _matchService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
  {
    var result = await _matchService.GetAllAsync(cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("admin")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetAdminPaged(
    [FromQuery] PaginationRequest pagination,
    [FromQuery] string? search,
    [FromQuery] int? divisionId,
    [FromQuery] int? matchWeek,
    [FromQuery] bool? isPlayed,
    [FromQuery] bool currentSeasonOnly = true,
    CancellationToken cancellationToken = default)
  {
    var result = await _matchService.GetAdminPagedAsync(
      search: search,
      divisionId: divisionId,
      matchWeek: matchWeek,
      isPlayed: isPlayed,
      currentSeasonOnly: currentSeasonOnly,
      currentPage: pagination.CurrentPage,
      pageSize: pagination.PageSize,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
  {
    var result = await _matchService.GetByIdAsync(id, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}/live-status")]
  public async Task<IActionResult> GetLiveStatus(Guid id, CancellationToken cancellationToken)
  {
    var result = await _matchService.GetLiveStatusAsync(id, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("club/{clubId:guid}")]
  public async Task<IActionResult> GetByClubId(Guid clubId, CancellationToken cancellationToken)
  {
    var result = await _matchService.GetByClubIdAsync(clubId, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("division/{divisionId:int}")]
  public async Task<IActionResult> GetByDivisionId(
    int divisionId,
    CancellationToken cancellationToken)
  {
    var result = await _matchService.GetByDivisionIdAsync(divisionId, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("division/{divisionId:int}/week/{matchWeek:int}")]
  public async Task<IActionResult> GetByDivisionAndMatchWeek(
    int divisionId,
    int matchWeek,
    CancellationToken cancellationToken)
  {
    var result = await _matchService.GetByDivisionAndMatchWeekAsync(
      divisionId,
      matchWeek,
      cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("scheduled-unplayed")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetScheduledUnplayed(
    [FromQuery] int count = 20,
    CancellationToken cancellationToken = default)
  {
    var result = await _matchService.GetScheduledUnplayedAsync(count, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Add([FromBody] CreateMatchRequest request, CancellationToken cancellationToken)
  {
    var result = await _matchService.AddAsync(
      request,
      GetUserRole(),
      cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateSchedule(
    [FromBody] UpdateMatchScheduleRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _matchService.UpdateScheduleAsync(
      request,
      GetUserRole(),
      cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("{id:guid}/simulate")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Simulate(Guid id, CancellationToken cancellationToken)
  {
    var result = await _matchService.SimulateAsync(
      id,
      GetUserRole(),
      cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:guid}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    var result = await _matchService.DeleteAsync(
      id,
      GetUserRole(),
      cancellationToken);

    return CreateActionResult(result);
  }
}
