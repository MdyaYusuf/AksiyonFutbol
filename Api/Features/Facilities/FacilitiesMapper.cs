using Riok.Mapperly.Abstractions;

namespace Api.Features.Facilities;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class FacilitiesMapper
{
  public ClubFacilityResponseDto ToFacilityDto(
    ClubFacility facility,
    int maxLevel,
    decimal nextUpgradeCost,
    bool canAfford,
    string facilityTypeName)
  {
    bool isMaxLevel = facility.Level >= maxLevel;

    return new ClubFacilityResponseDto
    {
      Id = facility.Id,
      ClubId = facility.ClubId,
      FacilityType = facility.FacilityType,
      FacilityTypeName = facilityTypeName,
      Level = facility.Level,
      MaxLevel = maxLevel,
      NextUpgradeCost = isMaxLevel ? 0m : nextUpgradeCost,
      CanUpgrade = !isMaxLevel && canAfford,
      IsMaxLevel = isMaxLevel
    };
  }

  public ClubFacilitiesOverviewDto ToOverviewDto(
    Clubs.Club club,
    IReadOnlyList<ClubFacilityResponseDto> facilities)
  {
    return new ClubFacilitiesOverviewDto
    {
      ClubId = club.Id,
      ClubName = club.Name,
      ClubCash = club.Cash,
      Morale = club.Morale,
      Chemistry = club.Chemistry,
      Discipline = club.Discipline,
      Suspicion = club.Suspicion,
      Facilities = facilities
    };
  }
}
