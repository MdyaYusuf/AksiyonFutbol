using Api.Core.Controllers;
using Api.Core.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Clubs;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClubsController(IClubService _clubService) : CustomBaseController
{
  [HttpGet]
  public async Task<IActionResult> GetAll(
    [FromQuery] PaginationRequest pagination,
    [FromQuery] string? search,
    [FromQuery] int? divisionId,
    [FromQuery] bool? isBot,
    CancellationToken cancellationToken = default)
  {
    var result = await _clubService.GetAllAsync(
      query: new ClubListQuery
      {
        Search = search,
        DivisionId = divisionId,
        IsBot = isBot,
        CurrentPage = pagination.CurrentPage,
        PageSize = pagination.PageSize
      },
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("options")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetOptions(CancellationToken cancellationToken = default)
  {
    var result = await _clubService.GetOptionsAsync(cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
  {
    var result = await _clubService.GetByIdAsync(
      id: id,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("me")]
  public async Task<IActionResult> GetCurrentUserClub(CancellationToken cancellationToken)
  {
    var result = await _clubService.GetByCurrentUserAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("me/exists")]
  public async Task<IActionResult> CheckCurrentUserHasClub(CancellationToken cancellationToken)
  {
    var result = await _clubService.CheckCurrentUserHasClubAsync(
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-president/{presidentId:guid}")]
  public async Task<IActionResult> GetByPresidentId(Guid presidentId, CancellationToken cancellationToken)
  {
    var result = await _clubService.GetAsync(
      predicate: c => c.PresidentId == presidentId,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("by-division/{divisionId:int}")]
  public async Task<IActionResult> GetByDivisionId(int divisionId, CancellationToken cancellationToken)
  {
    var result = await _clubService.GetByDivisionIdAsync(
      divisionId: divisionId,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpGet("creation-defaults")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> GetCreationDefaults(CancellationToken cancellationToken)
  {
    var result = await _clubService.GetCreationDefaultsAsync(cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost]
  public async Task<IActionResult> Add([FromBody] CreateClubRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubService.AddAsync(
      request: request,
      currentUserId: GetUserId(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("bot")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> AddBot([FromBody] CreateBotClubRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubService.AddBotAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut]
  public async Task<IActionResult> Update([FromBody] UpdateClubRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubService.UpdateAsync(
      request: request,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("finances")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateFinances([FromBody] UpdateClubFinancesRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubService.UpdateFinancesAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPut("status")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UpdateStatus([FromBody] UpdateClubStatusRequest request, CancellationToken cancellationToken)
  {
    var result = await _clubService.UpdateStatusAsync(
      request: request,
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
  {
    var result = await _clubService.RemoveAsync(
      id: id,
      currentUserId: GetUserId(),
      userRole: GetUserRole(),
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
