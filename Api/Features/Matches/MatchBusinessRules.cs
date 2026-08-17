using Api.Core.Exceptions;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Referees;

namespace Api.Features.Matches;

public class MatchBusinessRules(
  IMatchRepository _matchRepository,
  IClubRepository _clubRepository,
  ILeagueDivisionRepository _leagueDivisionRepository,
  IRefereeRepository _refereeRepository)
{
  public async Task<Match> GetMatchIfExistAsync(
    Guid id,
    Func<IQueryable<Match>, IQueryable<Match>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Match? match = await _matchRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (match == null)
    {
      throw new NotFoundException($"{id} numaralı maç bulunamadı.");
    }

    return match;
  }

  public async Task<Club> GetClubIfExistAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetByIdAsync(clubId, cancellationToken: cancellationToken);

    if (club == null)
    {
      throw new NotFoundException($"{clubId} numaralı kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<LeagueDivision> GetDivisionIfExistAsync(
    int divisionId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    LeagueDivision? division = await _leagueDivisionRepository.GetByIdAsync(
      divisionId,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (division == null)
    {
      throw new NotFoundException($"{divisionId} numaralı lig bulunamadı.");
    }

    return division;
  }

  public async Task DivisionMustExistAsync(int divisionId, CancellationToken cancellationToken = default)
  {
    await GetDivisionIfExistAsync(divisionId, cancellationToken: cancellationToken);
  }

  public async Task RefereeMustExistWhenProvidedAsync(int? refereeId, CancellationToken cancellationToken = default)
  {
    if (!refereeId.HasValue)
    {
      return;
    }

    bool exists = await _refereeRepository.AnyAsync(r => r.Id == refereeId.Value, cancellationToken);

    if (!exists)
    {
      throw new NotFoundException($"{refereeId} numaralı hakem bulunamadı.");
    }
  }

  public void ClubsMustBeDifferent(Guid homeClubId, Guid awayClubId)
  {
    if (homeClubId == awayClubId)
    {
      throw new BusinessException("Ev sahibi ve deplasman kulübü aynı olamaz.");
    }
  }

  public void ClubsMustBelongToDivision(Club homeClub, Club awayClub, int divisionId)
  {
    if (homeClub.DivisionId != divisionId || awayClub.DivisionId != divisionId)
    {
      throw new BusinessException("Maçtaki kulüpler belirtilen ligde yer almalıdır.");
    }
  }

  public async Task FixtureMustBeUniqueAsync(
    int divisionId,
    int season,
    int matchWeek,
    Guid homeClubId,
    Guid awayClubId,
    Guid? excludedId = null,
    CancellationToken cancellationToken = default)
  {
    bool exists = await _matchRepository.FixtureExistsAsync(
      divisionId,
      season,
      matchWeek,
      homeClubId,
      awayClubId,
      excludedId,
      cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu maç fikstürde zaten mevcut.");
    }
  }

  public void MatchMustNotBePlayed(Match match)
  {
    if (match.IsPlayed)
    {
      throw new BusinessException("Oynanmış maç üzerinde bu işlem yapılamaz.");
    }
  }

  public void MatchMustHaveReferee(Match match)
  {
    if (!match.RefereeId.HasValue)
    {
      throw new BusinessException("Maç simülasyonu için hakem atanmalıdır.");
    }
  }

  public void ClubsMustHaveAvailablePlayers(
    int homePlayerCount,
    int awayPlayerCount)
  {
    if (homePlayerCount == 0 || awayPlayerCount == 0)
    {
      throw new BusinessException("Maç simülasyonu için iki kulübün de en az bir uygun oyuncusu bulunmalıdır.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Maç yönetimi için yetkiniz bulunmamaktadır.");
    }
  }
}
