using Api.Core.Responses;

namespace Api.Features.Actions;

public interface IClubActionService
{
  Task<ReturnModel<ClubActionsContextResponseDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubActionResultDto>> ExecuteForCurrentUserAsync(
    ExecuteClubActionRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<ClubActionDto>>> GetMyHistoryAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
