using Api.Core.Repositories;
using Api.Core.Responses;

namespace Api.Features.Objectives;

public interface IObjectivesService
{
  Task<ReturnModel<ObjectivesContextDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClaimObjectiveResultDto>> ClaimForCurrentUserAsync(
    ClaimObjectiveRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ObjectivesContextDto>> EquipTitleForCurrentUserAsync(
    EquipTitleRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
