using Api.Core.Responses;

namespace Api.Features.ClubDrafts;

public interface IClubDraftService
{
  Task<ReturnModel<List<DraftCatalogPlayerDto>>> GetCatalogAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubDraftStateDto>> GetStateAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubDraftStateDto>> AddPickAsync(
    AddClubDraftPickRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubDraftStateDto>> RemovePickAsync(
    Guid basePlayerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<FinalizeClubDraftResponseDto>> FinalizeAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
