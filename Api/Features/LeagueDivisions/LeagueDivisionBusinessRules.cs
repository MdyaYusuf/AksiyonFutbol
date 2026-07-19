using Api.Core.Exceptions;
using Api.Core.Options;
using Microsoft.Extensions.Options;

namespace Api.Features.LeagueDivisions;

public class LeagueDivisionBusinessRules(
  ILeagueDivisionRepository _leagueDivisionRepository,
  IOptions<GameOptions> _gameOptions)
{
  public async Task<LeagueDivision> GetLeagueDivisionIfExistAsync(
    int id,
    Func<IQueryable<LeagueDivision>, IQueryable<LeagueDivision>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? leagueDivision = await _leagueDivisionRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (leagueDivision == null)
    {
      throw new NotFoundException($"{id} numaralı lig bulunamadı.");
    }

    return leagueDivision;
  }

  public async Task<LeagueDivision> GetLeagueDivisionByTierAndGroupIfExistAsync(
    int tier,
    int groupNumber,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? leagueDivision = await _leagueDivisionRepository.GetAsync(
      ld => ld.Tier == tier && ld.GroupNumber == groupNumber,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (leagueDivision == null)
    {
      throw new NotFoundException($"{tier}. seviye {groupNumber}. grup ligi bulunamadı.");
    }

    return leagueDivision;
  }

  public async Task NameMustBeUniqueAsync(
    string name,
    int? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool isUnique = await _leagueDivisionRepository.IsNameUniqueAsync(name, excludedId, cancellationToken);

    if (!isUnique)
    {
      throw new BusinessException("Bu lig adı zaten kullanımda.");
    }
  }

  public async Task TierGroupMustBeUniqueAsync(
    int tier,
    int groupNumber,
    int? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool isUnique = await _leagueDivisionRepository.IsTierGroupUniqueAsync(tier, groupNumber, excludedId, cancellationToken);

    if (!isUnique)
    {
      throw new BusinessException("Bu lig seviyesi ve grup numarası için zaten bir lig mevcut.");
    }
  }

  public void MatchWeekMustBeValid(int matchWeek)
  {
    if (matchWeek < _gameOptions.Value.MinimumMatchWeek || matchWeek > _gameOptions.Value.MaximumMatchWeek)
    {
      throw new BusinessException($"Maç haftası {_gameOptions.Value.MinimumMatchWeek} ile {_gameOptions.Value.MaximumMatchWeek} arasında olmalıdır.");
    }
  }

  public void LeagueCanAdvanceMatchWeek(LeagueDivision leagueDivision)
  {
    if (leagueDivision.CurrentMatchWeek >= _gameOptions.Value.MaximumMatchWeek)
    {
      throw new BusinessException("Lig sezonunun son maç haftasına ulaşmış durumda.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Lig yönetimi için yetkiniz bulunmamaktadır.");
    }
  }
}
