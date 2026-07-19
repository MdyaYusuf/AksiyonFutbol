using Api.Core.Responses;

namespace Api.Features.ClubLineups;

public interface IClubLineupService
{
  Task<ReturnModel<ClubLineupResponseDto>> GetForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubLineupResponseDto>> GetByClubIdAsync(
    Guid clubId,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubLineupResponseDto>> UpsertForCurrentUserAsync(
    UpsertClubLineupRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubLineupResponseDto>> UpsertByClubIdAsync(
    Guid clubId,
    UpsertClubLineupRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}
