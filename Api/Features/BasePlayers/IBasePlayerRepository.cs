using Api.Core.Repositories;

namespace Api.Features.BasePlayers;

public interface IBasePlayerRepository : IRepository<BasePlayer, Guid>
{
  Task<bool> TemplateExistsAsync(
    string defaultFirstName,
    string defaultLastName,
    string? nationality,
    PlayerPosition position,
    int age,
    int heightCm,
    int weightKg,
    PreferredFoot preferredFoot,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default);
}
