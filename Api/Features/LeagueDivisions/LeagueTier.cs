namespace Api.Features.LeagueDivisions;

/// <summary>
/// Competitive ladder tiers. Matches DraftTier naming for consistency.
/// Lower numeric value is a higher division (Gold = 1).
/// </summary>
public enum LeagueTier
{
  Gold = 1,
  Silver = 2,
  Bronze = 3,
  Iron = 4
}
