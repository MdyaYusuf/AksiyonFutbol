using Api.Core.Exceptions;

namespace Api.Features.LeagueDivisions;

public class LeagueDivisionBusinessRules(ILeagueDivisionRepository _leagueDivisionRepository)
{
  public const int MinimumMatchWeek = 1;
  public const int MaximumMatchWeek = 18;

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
    LeagueDivision? leagueDivision = await _leagueDivisionRepository.GetByTierAndGroupAsync(tier, groupNumber, enableTracking, cancellationToken);

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
    if (matchWeek < MinimumMatchWeek || matchWeek > MaximumMatchWeek)
    {
      throw new BusinessException($"Maç haftası {MinimumMatchWeek} ile {MaximumMatchWeek} arasında olmalıdır.");
    }
  }

  public void LeagueCanAdvanceMatchWeek(LeagueDivision leagueDivision)
  {
    if (leagueDivision.CurrentMatchWeek >= MaximumMatchWeek)
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
