namespace Api.Features.Facilities;

public sealed record UpgradeFacilityRequest(FacilityType FacilityType);

public sealed class ClubFacilityResponseDto
{
  public Guid Id { get; init; }
  public Guid ClubId { get; init; }
  public FacilityType FacilityType { get; init; }
  public string FacilityTypeName { get; init; } = default!;
  public int Level { get; init; }
  public int MaxLevel { get; init; }
  public decimal NextUpgradeCost { get; init; }
  public bool CanUpgrade { get; init; }
  public bool IsMaxLevel { get; init; }
}

public sealed class ClubFacilitiesOverviewDto
{
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public decimal ClubCash { get; init; }
  public int Morale { get; init; }
  public int Chemistry { get; init; }
  public int Discipline { get; init; }
  public IReadOnlyList<ClubFacilityResponseDto> Facilities { get; init; } = [];
}
