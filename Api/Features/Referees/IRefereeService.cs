using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Referees;

public interface IRefereeService
{
  Task<ReturnModel<PagedResponse<RefereeResponseDto>>> GetAllAsync(
    RefereeListQuery query,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<PagedResponse<RefereeResponseDto>>> GetAllAsync(
    Expression<Func<Referee, bool>>? filter = null,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    Func<IQueryable<Referee>, IOrderedQueryable<Referee>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RefereeResponseDto>> GetAsync(
    Expression<Func<Referee, bool>> predicate,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RefereeResponseDto>> GetByIdAsync(
    int id,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<RefereePreviewDto>>> GetByPersonalityTypeAsync(
    RefereePersonalityType personalityType,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<RefereePreviewDto>>> GetEasiestToBribeAsync(
    int count,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedRefereeResponseDto>> AddAsync(
    CreateRefereeRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateRefereeRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    int id,
    string userRole,
    CancellationToken cancellationToken = default);
}
