using Api.Core.Exceptions;

namespace Api.Features.ClubPresidents;

public class ClubPresidentBusinessRules(IClubPresidentRepository _clubPresidentRepository)
{
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
    ClubPresident? clubPresident = await _clubPresidentRepository.GetByUserIdAsync(userId, include, enableTracking, cancellationToken);

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
    var restrictedWords = new[] { "admin", "administrator", "system", "root", "support", "moderator", "aksiyonfutbol" };

    if (restrictedWords.Contains(name.ToLowerInvariant()))
    {
      throw new BusinessException("Seçtiğiniz başkan adı sistem tarafından rezerve edilmiştir. Lütfen farklı bir ad belirleyiniz.");
    }
  }
}
