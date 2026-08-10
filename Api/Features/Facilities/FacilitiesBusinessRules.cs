using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.Clubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.Facilities;

public class FacilitiesBusinessRules(
  IClubRepository _clubRepository,
  IClubFacilityRepository _clubFacilityRepository,
  IOptions<GameOptions> _gameOptions)
{
  public GameOptions Options => _gameOptions.Value;

  public static FacilityType[] AllFacilityTypes { get; } =
  [
    FacilityType.TrainingGround,
    FacilityType.YouthAcademy
  ];

  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      include,
      enableTracking,
      cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public async Task EnsureDefaultFacilitiesAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    List<ClubFacility> existing = await _clubFacilityRepository.GetAllAsync(
      filter: f => f.ClubId == clubId,
      cancellationToken: cancellationToken);

    HashSet<FacilityType> existingTypes = existing
      .Select(f => f.FacilityType)
      .ToHashSet();

    foreach (FacilityType facilityType in AllFacilityTypes)
    {
      if (existingTypes.Contains(facilityType))
      {
        continue;
      }

      await _clubFacilityRepository.AddAsync(
        new ClubFacility
        {
          ClubId = clubId,
          FacilityType = facilityType,
          Level = 1
        },
        cancellationToken);
    }
  }

  public async Task<ClubFacility> GetFacilityForClubAsync(
    Guid clubId,
    FacilityType facilityType,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    ClubFacility? facility = await _clubFacilityRepository.GetAsync(
      f => f.ClubId == clubId && f.FacilityType == facilityType,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    if (facility == null)
    {
      throw new NotFoundException("Kulüp tesisi bulunamadı.");
    }

    return facility;
  }

  public void FacilityMustNotBeMaxLevel(ClubFacility facility)
  {
    if (facility.Level >= Options.FacilityMaxLevel)
    {
      throw new BusinessException("Bu tesis zaten maksimum seviyede.");
    }
  }

  public decimal CalculateUpgradeCost(int currentLevel)
  {
    return Options.FacilityBaseUpgradeCost * currentLevel;
  }

  public void ClubMustAffordUpgrade(Club club, decimal cost)
  {
    if (club.Cash < cost)
    {
      throw new BusinessException("Kulüp kasası bu tesis yükseltmesini karşılamaya yetmiyor.");
    }
  }

  public string GetFacilityTypeName(FacilityType facilityType)
  {
    return facilityType switch
    {
      FacilityType.TrainingGround => "Training Ground",
      FacilityType.YouthAcademy => "Youth Academy",
      _ => facilityType.ToString()
    };
  }

  public Func<IQueryable<ClubFacility>, IQueryable<ClubFacility>> FacilityDetailInclude()
  {
    return query => query.Include(f => f.Club);
  }
}
