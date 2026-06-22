using Api.Core.Exceptions;

namespace Api.Features.BasePlayers;

public class BasePlayerBusinessRules(IBasePlayerRepository _basePlayerRepository)
{
  public async Task<BasePlayer> GetBasePlayerIfExistAsync(
    Guid id,
    Func<IQueryable<BasePlayer>, IQueryable<BasePlayer>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    BasePlayer? basePlayer = await _basePlayerRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (basePlayer == null)
    {
      throw new NotFoundException($"{id} numaralı oyuncu şablonu bulunamadı.");
    }

    return basePlayer;
  }

  public async Task TemplateMustBeUniqueAsync(
    string defaultFirstName,
    string defaultLastName,
    string? nationality,
    PlayerPosition position,
    int age,
    int heightCm,
    int weightKg,
    PreferredFoot preferredFoot,
    int attackPower,
    int defenseStrength,
    int midfieldControl,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool exists = await _basePlayerRepository.TemplateExistsAsync(
      defaultFirstName,
      defaultLastName,
      nationality,
      position,
      age,
      heightCm,
      weightKg,
      preferredFoot,
      attackPower,
      defenseStrength,
      midfieldControl,
      excludedId,
      cancellationToken);

    if (exists)
    {
      throw new BusinessException("Aynı özelliklere sahip oyuncu şablonu zaten mevcut.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Oyuncu şablonu yönetimi için yetkiniz bulunmamaktadır.");
    }
  }
}
