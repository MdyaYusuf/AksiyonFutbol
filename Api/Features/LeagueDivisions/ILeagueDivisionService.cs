using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.LeagueDivisions;

public interface ILeagueDivisionService
{
  Task<ReturnModel<PagedResponse<LeagueDivisionResponseDto>>> GetAllAsync(
    Expression<Func<LeagueDivision, bool>>? filter = null,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    Func<IQueryable<LeagueDivision>, IOrderedQueryable<LeagueDivision>>? orderBy = null,
    int currentPage = 1,
    int pageSize = 10,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<LeagueDivisionResponseDto>> GetAsync(
    Expression<Func<LeagueDivision, bool>> predicate,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<LeagueDivisionResponseDto>> GetByIdAsync(
    int id,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<LeagueDivisionPreviewDto>>> GetByTierAsync(
    int tier,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<LeagueDivisionResponseDto>> GetByTierAndGroupAsync(
    int tier,
    int groupNumber,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedLeagueDivisionResponseDto>> AddAsync(
    CreateLeagueDivisionRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateLeagueDivisionRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateCurrentMatchWeekAsync(
    UpdateLeagueDivisionMatchWeekRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> AdvanceMatchWeekAsync(
    int id,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    int id,
    string userRole,
    CancellationToken cancellationToken = default);
}
