using Api.Features.PlayerInstances;
using Api.Features.Referees;

namespace Api.Features.Matches;

public interface IMatchSimulationService
{
  SimulatedMatchResultDto Simulate(
    Match match,
    List<PlayerInstance> homePlayers,
    List<PlayerInstance> awayPlayers,
    Referee referee);
}
