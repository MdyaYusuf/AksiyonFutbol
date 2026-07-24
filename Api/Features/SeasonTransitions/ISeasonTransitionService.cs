using Api.Core.Responses;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;

namespace Api.Features.SeasonTransitions;

public interface ISeasonTransitionService
{
  Task<ReturnModel<SeasonEndPreviewDto>> PreviewByDivisionIdAsync(
    int divisionId,
    string userRole,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<SeasonEndProcessResultDto>> ProcessByDivisionIdAsync(
    int divisionId,
    string userRole,
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
