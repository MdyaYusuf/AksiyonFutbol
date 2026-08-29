using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.BasePlayers;

public interface IBasePlayerService
{
  Task<ReturnModel<PagedResponse<BasePlayerResponseDto>>> GetAllAsync(
    BasePlayerListQuery query,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<PagedResponse<BasePlayerResponseDto>>> GetAllAsync(
    Expression<Func<BasePlayer, bool>>? filter = null,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    Func<IQueryable<BasePlayer>, IOrderedQueryable<BasePlayer>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<BasePlayerResponseDto>> GetAsync(
    Expression<Func<BasePlayer, bool>> predicate,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<BasePlayerResponseDto>> GetByIdAsync(
    Guid id,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<BasePlayerPreviewDto>>> GetByPositionAsync(
    PlayerPosition position,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<BasePlayerOptionDto>>> GetOptionsAsync(
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedBasePlayerResponseDto>> AddAsync(
    CreateBasePlayerRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateBasePlayerRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default);
}
