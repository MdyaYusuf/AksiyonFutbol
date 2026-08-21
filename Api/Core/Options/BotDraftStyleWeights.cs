namespace Api.Core.Options;

/// <summary>
/// Relative weights for rolling a bot draft style. Need not sum to 1; sampler normalizes.
/// </summary>
public class BotDraftStyleWeights
{
  public decimal Balanced { get; set; } = 0.20m;
  public decimal YouthCheap { get; set; } = 0.20m;
  public decimal VeteranWages { get; set; } = 0.20m;
  public decimal StarHeavy { get; set; } = 0.20m;
  public decimal Depth { get; set; } = 0.20m;
}
