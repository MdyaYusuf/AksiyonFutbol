using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.ClubPresidents;

public interface IClubPresidentService
{
  Task<ReturnModel<PagedResponse<ClubPresidentResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<ClubPresident, bool>>? filter = null,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    Func<IQueryable<ClubPresident>, IOrderedQueryable<ClubPresident>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubPresidentResponseDto>> GetAsync(
    Expression<Func<ClubPresident, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubPresidentResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<ClubPresidentResponseDto>> GetByCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<bool>> CheckCurrentUserHasPresidentAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedClubPresidentResponseDto>> AddAsync(
    CreateClubPresidentRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateClubPresidentRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateReputationAsync(
    UpdateClubPresidentReputationRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}
