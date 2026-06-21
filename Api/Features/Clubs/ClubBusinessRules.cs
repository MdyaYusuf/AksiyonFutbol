using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.ClubPresidents;
using Api.Features.LeagueDivisions;
using Microsoft.Extensions.Options;

namespace Api.Features.Clubs;

public class ClubBusinessRules(
  IClubRepository _clubRepository,
  IClubPresidentRepository _clubPresidentRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IOptions<GameOptions> _gameOptions)
{
  public async Task<Club> GetClubIfExistAsync(
    Guid id,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (club == null)
    {
      throw new NotFoundException($"{id} numaralı kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetByUserIdAsync(userId, include, enableTracking, cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<ClubPresident> GetPresidentByUserIdIfExistAsync(
    Guid userId,
    CancellationToken cancellationToken = default)
  {
    ClubPresident? president = await _clubPresidentRepository.GetByUserIdAsync(userId, cancellationToken: cancellationToken);

    if (president == null)
    {
      throw new NotFoundException("Kulüp oluşturmadan önce kulüp başkanı profili oluşturmalısınız.");
    }

    return president;
  }

  public async Task DivisionMustExistAsync(int divisionId, CancellationToken cancellationToken = default)
  {
    bool exists = await _leagueDivisionRepository.AnyAsync(ld => ld.Id == divisionId, cancellationToken);

    if (!exists)
    {
      throw new NotFoundException($"{divisionId} numaralı lig bulunamadı.");
    }
  }

  public async Task DivisionMustHaveCapacityAsync(int divisionId, CancellationToken cancellationToken = default)
  {
    int clubCount = await _clubRepository.CountByDivisionIdAsync(divisionId, cancellationToken);

    if (clubCount >= _gameOptions.Value.MaximumClubsPerDivision)
    {
      throw new BusinessException("Bu lig grubu maksimum kulüp kapasitesine ulaşmış durumda.");
    }
  }

  public async Task PresidentMustNotHaveClubAsync(Guid presidentId, CancellationToken cancellationToken = default)
  {
    bool exists = await _clubRepository.PresidentHasClubAsync(presidentId, cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu kulüp başkanının zaten bir kulübü var.");
    }
  }

  public async Task ClubNameMustBeUniqueAsync(
    string name,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool isUnique = await _clubRepository.IsNameUniqueAsync(name, excludedId, cancellationToken);

    if (!isUnique)
    {
      throw new BusinessException("Bu kulüp adı zaten kullanımda.");
    }
  }

  public void ClubMustBelongToCurrentUserOrAdmin(Club club, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    if (club.President == null || club.President.UserId != currentUserId)
    {
      throw new ForbiddenException("Bu kulüp üzerinde işlem yapma yetkiniz bulunmamaktadır.");
    }
  }

  public void BotClubCannotHavePresident(Club club)
  {
    if (club.IsBot && club.PresidentId != null)
    {
      throw new BusinessException("Bot kulüpler gerçek bir kulüp başkanına bağlanamaz.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Kulüp yönetimi için yetkiniz bulunmamaktadır.");
    }
  }

  public void ClubNameCannotBeRestrictedWord(string name)
  {
    var restrictedWords = new[] { "admin", "administrator", "system", "root", "support", "moderator", "aksiyonfutbol" };

    if (restrictedWords.Contains(name.ToLowerInvariant()))
    {
      throw new BusinessException("Seçtiğiniz kulüp adı sistem tarafından rezerve edilmiştir. Lütfen farklı bir ad belirleyiniz.");
    }
  }
}
