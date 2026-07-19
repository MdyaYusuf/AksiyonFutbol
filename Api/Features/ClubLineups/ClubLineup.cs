using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;

namespace Api.Features.ClubLineups;

public class ClubLineup : Entity<Guid>
{
  [SetsRequiredMembers]
  public ClubLineup()
  {
    Selections = new HashSet<ClubLineupSelection>();
    Formation = TeamFormation.FourThreeThree;
    Mentality = TeamMentality.Balanced;
  }

  public TeamFormation Formation { get; set; }
  public TeamMentality Mentality { get; set; }

  public Guid ClubId { get; set; }
  public virtual Club Club { get; set; } = default!;
  public virtual ICollection<ClubLineupSelection> Selections { get; set; }
}
