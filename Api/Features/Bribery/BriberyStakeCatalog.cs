namespace Api.Features.Bribery;

internal static class BriberyStakeCatalog
{
  internal static (string Title, string Description) GetCopy(BribeStakeTier tier)
  {
    return tier switch
    {
      BribeStakeTier.Low => (
        "Quiet Word",
        "Low exposure. Soft nudges on midfield calls. Unlikely to swing major decisions."),
      BribeStakeTier.Medium => (
        "Preparation Edge",
        "Moderate exposure. Clearer leniency on cards for your side, firmer calls against the opponent."),
      BribeStakeTier.High => (
        "Full Arrangement",
        "High exposure. Strong tilt on critical moments — spot kicks, dismissals, and late drama."),
      _ => ("Approach", "A quiet arrangement with the match official.")
    };
  }
}
