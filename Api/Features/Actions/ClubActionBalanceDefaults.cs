using Api.Core.Options;

namespace Api.Features.Actions;

// Code defaults for every action's balancing. GameOptions overrides (by action
// name) are merged on top of these by ClubActionProvider, so config only needs
// to specify the values it wants to change. These numbers are balancing
// placeholders and will be tuned as each action's effects land.
public static class ClubActionBalanceDefaults
{
  public static Dictionary<ClubActionType, ClubActionBalance> Build()
  {
    return new Dictionary<ClubActionType, ClubActionBalance>
    {
      [ClubActionType.MatchFixing] = new()
      {
        Cost = 30000m,
        HeatGenerated = 30,
        BaseSuccessChance = 0.60m,
        BaseDetectionChance = 0.40m
      },
      [ClubActionType.Doping] = new()
      {
        Cost = 20000m,
        HeatGenerated = 25,
        BaseSuccessChance = 0.75m,
        BaseDetectionChance = 0.35m
      },
      [ClubActionType.Espionage] = new()
      {
        Cost = 8000m,
        HeatGenerated = 8,
        BaseSuccessChance = 0.90m,
        BaseDetectionChance = 0.10m
      },
      [ClubActionType.Sabotage] = new()
      {
        Cost = 15000m,
        HeatGenerated = 20,
        BaseSuccessChance = 0.65m,
        BaseDetectionChance = 0.30m
      },
      [ClubActionType.IntimidateReferee] = new()
      {
        Cost = 10000m,
        HeatGenerated = 22,
        BaseSuccessChance = 0.55m,
        BaseDetectionChance = 0.35m
      },
      [ClubActionType.TeamBonding] = new()
      {
        Cost = 5000m,
        BaseSuccessChance = 1m,
        CooldownDays = 7
      },
      [ClubActionType.FinePlayer] = new()
      {
        Cost = 0m,
        BaseSuccessChance = 1m,
        CooldownDays = 7
      },
      [ClubActionType.MotivationalTalk] = new()
      {
        Cost = 0m,
        BaseSuccessChance = 1m,
        CooldownDays = 3
      },
      [ClubActionType.BrutalTraining] = new()
      {
        Cost = 0m,
        BaseSuccessChance = 1m,
        CooldownDays = 7
      },
      [ClubActionType.PromiseWinBonus] = new()
      {
        Cost = 0m,
        BaseSuccessChance = 1m,
        CooldownDays = 7
      },
      [ClubActionType.MediaSpin] = new()
      {
        Cost = 4000m,
        HeatGenerated = 5,
        BaseSuccessChance = 0.80m,
        BaseDetectionChance = 0.10m,
        CooldownDays = 5
      },
      [ClubActionType.LobbyFederation] = new()
      {
        Cost = 12000m,
        HeatGenerated = 0,
        BaseSuccessChance = 0.60m,
        BaseDetectionChance = 0.25m,
        CooldownDays = 14
      },
      [ClubActionType.DodgySponsorship] = new()
      {
        Cost = 0m,
        HeatGenerated = 35,
        BaseSuccessChance = 0.85m,
        BaseDetectionChance = 0.50m,
        CooldownDays = 14
      },
      [ClubActionType.TapUpTarget] = new()
      {
        Cost = 6000m,
        HeatGenerated = 12,
        BaseSuccessChance = 0.70m,
        BaseDetectionChance = 0.20m,
        CooldownDays = 7
      }
    };
  }
}
