namespace Api.Features.ClubLineups;

public interface IMatchDaySquadResolver
{
  Task<MatchDaySquad> ResolveAsync(
    Guid clubId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);
}
