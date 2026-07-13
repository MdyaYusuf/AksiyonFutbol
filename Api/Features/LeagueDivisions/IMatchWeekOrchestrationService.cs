using Api.Core.Responses;

namespace Api.Features.LeagueDivisions;

public interface IMatchWeekOrchestrationService
{
  Task<ReturnModel<ProcessMatchWeekResultDto>> ProcessCurrentWeekAsync(
    int divisionId,
    string userRole,
    CancellationToken cancellationToken = default);
}
