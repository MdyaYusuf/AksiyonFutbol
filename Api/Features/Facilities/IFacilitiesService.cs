using Api.Core.Responses;

namespace Api.Features.Facilities;

public interface IFacilitiesService
{
  Task<ReturnModel<ClubFacilitiesOverviewDto>> GetForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubFacilitiesOverviewDto>> UpgradeForCurrentUserAsync(
    UpgradeFacilityRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);
}
