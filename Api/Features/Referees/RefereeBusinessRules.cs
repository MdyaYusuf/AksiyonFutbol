using Api.Core.Exceptions;

namespace Api.Features.Referees;

public class RefereeBusinessRules(IRefereeRepository _refereeRepository)
{
  public async Task<Referee> GetRefereeIfExistAsync(
    int id,
    Func<IQueryable<Referee>, IQueryable<Referee>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Referee? referee = await _refereeRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (referee == null)
    {
      throw new NotFoundException($"{id} numaralı hakem bulunamadı.");
    }

    return referee;
  }

  public async Task NameMustBeUniqueAsync(
    string name,
    int? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool isUnique = await _refereeRepository.IsNameUniqueAsync(name, excludedId, cancellationToken);

    if (!isUnique)
    {
      throw new BusinessException("Bu hakem adı zaten kullanımda.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Hakem yönetimi için yetkiniz bulunmamaktadır.");
    }
  }
}
