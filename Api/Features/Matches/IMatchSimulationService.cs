using Api.Features.PlayerInstances;
using Api.Features.Referees;
using Api.Features.ClubLineups;

namespace Api.Features.Matches;

public interface IMatchSimulationService
{
  SimulatedMatchResultDto Simulate(
    Match match,
    MatchDaySquad homeSquad,
    MatchDaySquad awaySquad,
    Referee referee);
}
