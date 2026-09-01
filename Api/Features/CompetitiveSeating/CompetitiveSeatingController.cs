using Api.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.CompetitiveSeating;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/competitive-seating")]
public class CompetitiveSeatingController(ICompetitiveSeatingService _competitiveSeatingService)
  : CustomBaseController
{
  [HttpGet("queue")]
  public async Task<IActionResult> GetQueue(CancellationToken cancellationToken)
  {
    var result = await _competitiveSeatingService.GetQueuePreviewAsync(cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("run")]
  public async Task<IActionResult> Run(CancellationToken cancellationToken)
  {
    var result = await _competitiveSeatingService.RunSeatingAsync(cancellationToken);

    return CreateActionResult(result);
  }
}
