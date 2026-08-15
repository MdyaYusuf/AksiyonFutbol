using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.PlayerInstances;

namespace Api.Features.PlayerInstances;

public static class PlayerInstanceFromBasePlayer
{
  public static PlayerInstance Create(
    Guid clubId,
    BasePlayer basePlayer,
    decimal marketValue,
    decimal wage)
  {
    ArgumentNullException.ThrowIfNull(basePlayer);

    PlayerInstance player = new()
    {
      FirstName = basePlayer.DefaultFirstName,
      LastName = basePlayer.DefaultLastName,
      ClubId = clubId,
      BasePlayerId = basePlayer.Id,
      Nationality = basePlayer.Nationality,
      Position = basePlayer.Position,
      Age = basePlayer.Age,
      HeightCm = basePlayer.HeightCm,
      WeightKg = basePlayer.WeightKg,
      PreferredFoot = basePlayer.PreferredFoot,
      AttackPower = basePlayer.AttackPower,
      DefenseStrength = basePlayer.DefenseStrength,
      MidfieldControl = basePlayer.MidfieldControl,
      MarketValue = marketValue,
      Wage = wage,
      IsInjured = false,
      InjuryDays = 0
    };

    PlayerAttributeMapper.CopySubStats(basePlayer, player);
    PlayerAttributeCalculator.ApplyMainStats(player);
    return player;
  }

  public static PlayerInstance CreateWithStarterPricing(
    Guid clubId,
    BasePlayer basePlayer,
    GameOptions options)
  {
    ArgumentNullException.ThrowIfNull(options);

    int overall = BasePlayerRatingCalculator.Calculate(basePlayer);

    return Create(
      clubId,
      basePlayer,
      overall * options.StarterMarketValuePerOverall,
      overall * options.StarterWagePerOverall);
  }
}
