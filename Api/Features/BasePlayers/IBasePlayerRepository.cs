using Api.Core.Repositories;

namespace Api.Features.BasePlayers;

public interface IBasePlayerRepository : IRepository<BasePlayer, Guid>
{
  Task<List<BasePlayer>> GetByPositionAsync(
    PlayerPosition position,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<bool> TemplateExistsAsync(
    string defaultFirstName,
    string defaultLastName,
    string? nationality,
    PlayerPosition position,
    int age,
    int attackPower,
    int defenseStrength,
    int midfieldControl,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default);
}
