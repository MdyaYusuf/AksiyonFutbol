namespace Api.Features.ClubPresidents;

public sealed class SeasonPresidentPackageDto
{
  public string IdentityTrack { get; init; } = default!;
  public decimal CashAwarded { get; init; }
  public string FlavorTitle { get; init; } = default!;
  public string Summary { get; init; } = default!;
}
