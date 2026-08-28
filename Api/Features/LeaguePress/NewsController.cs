using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.LeaguePress;

[Authorize]
[ApiController]
[Route("api/news")]
public class NewsController(ILeaguePressService _leaguePressService) : CustomBaseController
{
  [HttpGet("me")]
  public async Task<IActionResult> GetMyFeed(
    [FromQuery] NewsArticleKind? kind,
    [FromQuery] int? limit,
    CancellationToken cancellationToken)
  {
    var result = await _leaguePressService.GetMyFeedAsync(
      currentUserId: GetUserId(),
      kind: kind,
      limit: limit,
      cancellationToken: cancellationToken);

    return CreateActionResult(result);
  }
}
