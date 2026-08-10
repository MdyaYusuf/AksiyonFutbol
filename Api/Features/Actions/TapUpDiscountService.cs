using Api.Features.PlayerInstances;

namespace Api.Features.Actions;

/// <summary>
/// Resolves tap-up discounts for transfer fee settlement. A successful TapUpTarget
/// ClubAction for the buying club + player reduces the fee paid at accept time.
/// </summary>
public interface ITapUpDiscountService
{
  Task<decimal> GetDiscountedFeeAsync(
    Guid buyingClubId,
    Guid playerInstanceId,
    decimal offerFee,
    CancellationToken cancellationToken = default);
}

public class TapUpDiscountService(
  IClubActionRepository _clubActionRepository,
  ClubActionBusinessRules _businessRules) : ITapUpDiscountService
{
  public async Task<decimal> GetDiscountedFeeAsync(
    Guid buyingClubId,
    Guid playerInstanceId,
    decimal offerFee,
    CancellationToken cancellationToken = default)
  {
    bool hasTapUp = await _clubActionRepository.AnyAsync(
      a =>
        a.ClubId == buyingClubId &&
        a.TargetPlayerInstanceId == playerInstanceId &&
        a.ActionType == ClubActionType.TapUpTarget &&
        a.Outcome == ClubActionOutcome.Succeeded,
      cancellationToken);

    if (!hasTapUp)
    {
      return offerFee;
    }

    decimal ratio = _businessRules.GetTapUpDiscountRatio();
    decimal discounted = offerFee * (1m - ratio);

    if (discounted < 0m)
    {
      return 0m;
    }

    return Math.Round(discounted, 2);
  }
}
