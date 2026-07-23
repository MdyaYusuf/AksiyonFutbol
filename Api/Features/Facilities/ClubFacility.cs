using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;

namespace Api.Features.Facilities;

public class ClubFacility : Entity<Guid>
{
  [SetsRequiredMembers]
  public ClubFacility()
  {
    Level = 1;
  }

  public FacilityType FacilityType { get; set; }
  public int Level { get; set; }

  public Guid ClubId { get; set; }
  public virtual Club Club { get; set; } = default!;
}
