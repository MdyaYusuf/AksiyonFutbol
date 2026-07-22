using Api.Core.Responses;

namespace Api.Features.Bribery;

public interface IBriberyService
{
  Task<ReturnModel<BriberyContextResponseDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<BribeAttemptResponseDto>> CreateAttemptForCurrentUserAsync(
    CreateBribeAttemptRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<BribeAttemptResponseDto>>> GetMyAttemptsAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
