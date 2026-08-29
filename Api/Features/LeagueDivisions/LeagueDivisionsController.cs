using Api.Core.Controllers;
using Api.Core.Requests;
using Api.Features.SeasonTransitions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.LeagueDivisions;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LeagueDivisionsController(
  ILeagueDivisionService _leagueDivisionService,
  IMatchWeekOrchestrationService _matchWeekOrchestrationService,
  ISeasonTransitionService _seasonTransitionService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    [FromQuery] string? search,
    CancellationToken cancellationToken = default)
  {
    var result = await _leagueDivisionService.GetAllAsync(
      query: new LeagueDivisionListQuery
      {
        Search = search,
        CurrentPage = pagination.CurrentPage,
        PageSize = pagination.PageSize
      },
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

  [HttpPost("{id:int}/process-week")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> ProcessWeek(int id, CancellationToken cancellationToken)
  {
    var result = await _matchWeekOrchestrationService.ProcessCurrentWeekAsync(
      divisionId: id,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:int}/season-end-preview")]
  public async Task<IActionResult> SeasonEndPreview(int id, CancellationToken cancellationToken)
  {
    var result = await _seasonTransitionService.PreviewByDivisionIdAsync(
      divisionId: id,
      userRole: GetUserRole(),
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("{id:int}/process-season-end")]
  public async Task<IActionResult> ProcessSeasonEnd(int id, CancellationToken cancellationToken)
  {
    var result = await _seasonTransitionService.ProcessByDivisionIdAsync(
      divisionId: id,
      userRole: GetUserRole(),
      currentUserId: GetUserId(),
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
