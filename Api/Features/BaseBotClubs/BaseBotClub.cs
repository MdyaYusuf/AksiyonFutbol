using Api.Core.Entities;
using Api.Features.ClubLineups;

namespace Api.Features.BaseBotClubs;

public class BaseBotClub : Entity<Guid>
{
  public required string Name { get; set; }
  public int StartingMorale { get; set; } = 50;
  public int StartingChemistry { get; set; } = 50;
  public int StartingDiscipline { get; set; } = 50;
  public TeamFormation? PreferredFormation { get; set; }

  /// <summary>
  /// Tutorial bots (Kardelenspor, Anadoluspor, Poyrazspor). Competitive pool bots are false.
  /// </summary>
  public bool IsTutorialTemplate { get; set; }
}
