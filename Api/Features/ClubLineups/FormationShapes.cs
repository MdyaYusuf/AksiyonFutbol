using Api.Features.BasePlayers;

namespace Api.Features.ClubLineups;

public static class FormationShapes
{
  public static FormationShape Get(TeamFormation formation)
  {
    return formation switch
    {
      TeamFormation.FourFourTwo => new FormationShape(1, 4, 4, 2),
      TeamFormation.ThreeFiveTwo => new FormationShape(1, 3, 5, 2),
      TeamFormation.FourTwoThreeOne => new FormationShape(1, 4, 5, 1),
      _ => new FormationShape(1, 4, 3, 3)
    };
  }
}

public readonly record struct FormationShape(int Goalkeepers, int Defenders, int Midfielders, int Forwards)
{
  public int Total => Goalkeepers + Defenders + Midfielders + Forwards;

  public int CountFor(PlayerPosition position)
  {
    return position switch
    {
      PlayerPosition.Goalkeeper => Goalkeepers,
      PlayerPosition.Defender => Defenders,
      PlayerPosition.Midfielder => Midfielders,
      PlayerPosition.Forward => Forwards,
      _ => 0
    };
  }
}
