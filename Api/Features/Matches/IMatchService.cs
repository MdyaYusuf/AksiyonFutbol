using Api.Core.Responses;

namespace Api.Features.Matches;

public interface IMatchService
{
  Task<ReturnModel<List<MatchResponseDto>>> GetAllAsync(CancellationToken cancellationToken = default);

  Task<ReturnModel<MatchResponseDto>> GetByIdAsync(
    Guid id,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MatchLiveStatusDto>> GetLiveStatusAsync(
    Guid id,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<MatchPreviewDto>>> GetByClubIdAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<MatchPreviewDto>>> GetByDivisionAndMatchWeekAsync(
    int divisionId,
    int matchWeek,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<List<MatchPreviewDto>>> GetScheduledUnplayedAsync(
    int count,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedMatchResponseDto>> AddAsync(
    CreateMatchRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MatchResponseDto>> UpdateScheduleAsync(
    UpdateMatchScheduleRequest request,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MatchResponseDto>> SimulateAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<string>> DeleteAsync(
    Guid id,
    string userRole,
    CancellationToken cancellationToken = default);
}
