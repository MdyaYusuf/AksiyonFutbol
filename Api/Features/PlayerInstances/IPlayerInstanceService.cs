using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.PlayerInstances;

public interface IPlayerInstanceService
{
  Task<ReturnModel<PagedResponse<PlayerInstanceResponseDto>>> GetAllAsync(
    Expression<Func<PlayerInstance, bool>>? filter = null,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    Func<IQueryable<PlayerInstance>, IOrderedQueryable<PlayerInstance>>? orderBy = null,
    int pageNumber = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<PlayerInstanceResponseDto>> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<PlayerInstancePreviewDto>>> GetByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<PlayerInstanceResponseDto>>> GetCurrentUserClubPlayersAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<PlayerInstancePreviewDto>>> GetAvailableByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<PlayerInstancePreviewDto>>> GetInjuredByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedPlayerInstanceResponseDto>> AddFromBasePlayerAsync(
    CreatePlayerInstanceFromBasePlayerRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedPlayerInstanceResponseDto>> AddCustomAsync(
    CreateCustomPlayerInstanceRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateNameAsync(
    UpdatePlayerInstanceNameRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateStatsAsync(
    UpdatePlayerInstanceStatsRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateHealthAsync(
    UpdatePlayerInstanceHealthRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateSeasonStatsAsync(
    UpdatePlayerInstanceSeasonStatsRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default);
}
