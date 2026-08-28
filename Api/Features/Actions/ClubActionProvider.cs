using Api.Core.Options;
using Microsoft.Extensions.Options;

namespace Api.Features.Actions;

// Combines the static ClubActionCatalog metadata (text + structural flags) with
// balancing numbers into a single runtime ClubActionDefinition. Numbers come
// from the feature's code defaults, with GameOptions overrides (keyed by action
// name) merged on top.
public class ClubActionProvider : IClubActionProvider
{
  private static readonly IReadOnlyDictionary<ClubActionType, ClubActionBalance> _defaultBalances =
    ClubActionBalanceDefaults.Build();

  private readonly IOptions<GameOptions> _gameOptions;

  public ClubActionProvider(IOptions<GameOptions> gameOptions)
  {
    _gameOptions = gameOptions;
    EnsureEveryActionHasDefaultBalance();
  }

  public ClubActionDefinition Get(ClubActionType type)
  {
    ClubActionMetadata metadata = ClubActionCatalog.Get(type);
    ClubActionBalance balance = GetBalance(type);

    return Combine(metadata, balance);
  }

  public IReadOnlyCollection<ClubActionDefinition> All()
  {
    return ClubActionCatalog.All
      .Select(metadata => Combine(metadata, GetBalance(metadata.Type)))
      .ToList();
  }

  private ClubActionBalance GetBalance(ClubActionType type)
  {
    // Config overrides (by action name) take precedence over code defaults.
    if (_gameOptions.Value.ClubActionBalances.TryGetValue(type.ToString(), out ClubActionBalance? overrideBalance))
    {
      return overrideBalance;
    }

    return _defaultBalances[type];
  }

  private static ClubActionDefinition Combine(ClubActionMetadata metadata, ClubActionBalance balance)
  {
    return new ClubActionDefinition
    {
      Type = metadata.Type,
      Category = metadata.Category,
      DisplayName = metadata.DisplayName,
      Description = metadata.Description,
      IsShady = metadata.IsShady,
      IsMatchScoped = metadata.IsMatchScoped,
      Cost = balance.Cost,
      HeatGenerated = balance.HeatGenerated,
      BaseSuccessChance = balance.BaseSuccessChance,
      BaseDetectionChance = balance.BaseDetectionChance,
      CooldownDays = balance.CooldownDays,
      MinCharisma = metadata.MinCharisma,
      MinAuthority = metadata.MinAuthority,
      MinIntegrity = metadata.MinIntegrity,
      MinCunning = metadata.MinCunning,
      MinConnections = metadata.MinConnections,
      MinLegitimacy = metadata.MinLegitimacy,
      RequiresShadyTierII = metadata.RequiresShadyTierII
    };
  }

  private static void EnsureEveryActionHasDefaultBalance()
  {
    foreach (ClubActionType type in Enum.GetValues<ClubActionType>())
    {
      if (!_defaultBalances.ContainsKey(type))
      {
        throw new InvalidOperationException(
          $"{type} aksiyonu için varsayılan denge ayarı tanımlı değil.");
      }
    }
  }
}
