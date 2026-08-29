using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Clubs;

public interface IClubService
{
  Task<ReturnModel<PagedResponse<ClubResponseDto>>> GetAllAsync(
    ClubListQuery query,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<PagedResponse<ClubResponseDto>>> GetAllAsync(
    Expression<Func<Club, bool>>? filter = null,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    Func<IQueryable<Club>, IOrderedQueryable<Club>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubResponseDto>> GetAsync(
    Expression<Func<Club, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubResponseDto>> GetByCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<ClubPreviewDto>>> GetByDivisionIdAsync(
    int divisionId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<bool>> CheckCurrentUserHasClubAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubCreationDefaultsDto>> GetCreationDefaultsAsync(
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<ClubOptionDto>>> GetOptionsAsync(
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedClubResponseDto>> AddAsync(
    CreateClubRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedClubResponseDto>> AddBotAsync(
    CreateBotClubRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateClubRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateFinancesAsync(
    UpdateClubFinancesRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateStatusAsync(
    UpdateClubStatusRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}
