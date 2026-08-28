using Api.Features.PlayerInstances;

namespace Api.Features.Actions;

/// <summary>
/// Resolves tap-up discounts for transfer fee settlement. A successful TapUpTarget
/// or TapUpTargetII ClubAction for the buying club + player reduces the fee paid at accept time.
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
    List<ClubAction> tapUps = await _clubActionRepository.GetAllAsync(
      filter: a =>
        a.ClubId == buyingClubId &&
        a.TargetPlayerInstanceId == playerInstanceId &&
        (a.ActionType == ClubActionType.TapUpTarget ||
         a.ActionType == ClubActionType.TapUpTargetII) &&
        a.Outcome == ClubActionOutcome.Succeeded,
      cancellationToken: cancellationToken);

    ClubAction? bestTapUp = tapUps
      .OrderByDescending(a => a.ActionType == ClubActionType.TapUpTargetII)
      .ThenByDescending(a => a.CreatedDate)
      .FirstOrDefault();

    if (bestTapUp == null)
    {
      return offerFee;
    }

    decimal ratio = _businessRules.GetTapUpDiscountRatio(bestTapUp.ActionType);
    decimal discounted = offerFee * (1m - ratio);

    if (discounted < 0m)
    {
      return 0m;
    }

    return Math.Round(discounted, 2);
  }
}
