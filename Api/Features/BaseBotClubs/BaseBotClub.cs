using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.ClubLineups;

namespace Api.Features.BaseBotClubs;

public class BaseBotClub : Entity<Guid>
{
  [SetsRequiredMembers]
  public BaseBotClub()
  {
    Name = default!;
    StartingMorale = 50;
    StartingChemistry = 50;
    StartingDiscipline = 50;
  }

  public required string Name { get; set; }
  public int StartingMorale { get; set; }
  public int StartingChemistry { get; set; }
  public int StartingDiscipline { get; set; }
  public TeamFormation? PreferredFormation { get; set; }

  /// <summary>
  /// Tutorial bots (Kardelenspor, Anadoluspor, Poyrazspor). Competitive pool bots are false.
  /// </summary>
  public bool IsTutorialTemplate { get; set; }
}
