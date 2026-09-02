using Api.Core.Exceptions;
using Api.Core.Validation;

namespace Api.Features.ClubPresidents;

public class ClubPresidentBusinessRules(IClubPresidentRepository _clubPresidentRepository)
{
  public const int AttributeMin = 1;
  public const int AttributeMax = 5;
  public const int AttributePointBudget = 8;

  public static int CalculateSpentAttributePoints(
    int charisma,
    int authority,
    int integrity,
    int cunning,
    int connections)
  {
    return (charisma - AttributeMin)
      + (authority - AttributeMin)
      + (integrity - AttributeMin)
      + (cunning - AttributeMin)
      + (connections - AttributeMin);
  }

  public void EnsureValidAttributeAllocation(
    int charisma,
    int authority,
    int integrity,
    int cunning,
    int connections)
  {
    EnsureAttributeInRange(nameof(ClubPresident.Charisma), charisma);
    EnsureAttributeInRange(nameof(ClubPresident.Authority), authority);
    EnsureAttributeInRange(nameof(ClubPresident.Integrity), integrity);
    EnsureAttributeInRange(nameof(ClubPresident.Cunning), cunning);
    EnsureAttributeInRange(nameof(ClubPresident.Connections), connections);

    int spent = CalculateSpentAttributePoints(
      charisma,
      authority,
      integrity,
      cunning,
      connections);

    if (spent != AttributePointBudget)
    {
      throw new BusinessException(
        $"Başkan özellikleri için tam {AttributePointBudget} puan dağıtılmalıdır. Dağıtılan: {spent}.");
    }
  }

  private static void EnsureAttributeInRange(string attributeName, int value)
  {
    if (value < AttributeMin || value > AttributeMax)
    {
      throw new BusinessException(
        $"{attributeName} {AttributeMin} ile {AttributeMax} arasında olmalıdır.");
    }
  }

  public async Task<ClubPresident> GetClubPresidentIfExistAsync(
    Guid id,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    ClubPresident? clubPresident = await _clubPresidentRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (clubPresident == null)
    {
      throw new NotFoundException($"{id} numaralı kulüp başkanı bulunamadı.");
    }

    return clubPresident;
  }

  public async Task<ClubPresident> GetClubPresidentByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<ClubPresident>, IQueryable<ClubPresident>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    ClubPresident? clubPresident = await _clubPresidentRepository.GetAsync(
      cp => cp.UserId == userId,
      include,
      enableTracking,
      cancellationToken);

    if (clubPresident == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp başkanı bulunamadı.");
    }

    return clubPresident;
  }

  public async Task UserMustNotHavePresidentAsync(Guid userId, CancellationToken cancellationToken = default)
  {
    bool exists = await _clubPresidentRepository.UserHasPresidentAsync(userId, cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu kullanıcı için zaten bir kulüp başkanı oluşturulmuş.");
    }
  }

  public async Task PresidentNameMustBeUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool isUnique = await _clubPresidentRepository.IsNameUniqueAsync(name, excludedId, cancellationToken);

    if (!isUnique)
    {
      throw new BusinessException("Bu başkan adı zaten kullanımda.");
    }
  }

  public void PresidentMustBelongToCurrentUserOrAdmin(
    ClubPresident clubPresident,
    Guid currentUserId,
    string userRole)
  {
    if (clubPresident.UserId != currentUserId && userRole != "Admin")
    {
      throw new ForbiddenException("Bu kulüp başkanı üzerinde işlem yapma yetkiniz bulunmamaktadır.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Kulüp başkanı yönetimi için yetkiniz bulunmamaktadır.");
    }
  }

  public void PresidentNameCannotBeRestrictedWord(string name)
  {
    RestrictedNameWords.EnsureIsNotRestricted(name, "başkan adı");
  }
}
