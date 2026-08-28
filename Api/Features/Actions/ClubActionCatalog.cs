using Api.Core.Exceptions;
using Api.Features.ClubPresidents;

namespace Api.Features.Actions;

// Static, immutable descriptive metadata for every action: display text and the
// structural flags that never change at balancing time. All numeric balancing
// (cost, heat, chances, cooldown) is sourced from GameOptions and combined with
// this metadata by ClubActionProvider.
public static class ClubActionCatalog
{
  private static readonly IReadOnlyDictionary<ClubActionType, ClubActionMetadata> _metadata =
    new List<ClubActionMetadata>
    {
      new()
      {
        Type = ClubActionType.MatchFixing,
        Category = ClubActionCategory.Match,
        DisplayName = "Quiet Arrangement",
        Description = "Persuade a key opponent to take their foot off the gas in the next fixture.",
        IsShady = true,
        IsMatchScoped = true,
        MinCunning = 2
      },
      new()
      {
        Type = ClubActionType.Doping,
        Category = ClubActionCategory.Match,
        DisplayName = "Preparation Edge",
        Description = "Push recovery and prep past regulation for a short-term boost next match.",
        IsShady = true,
        IsMatchScoped = true,
        MinCunning = 2
      },
      new()
      {
        Type = ClubActionType.Espionage,
        Category = ClubActionCategory.Match,
        DisplayName = "Scout the Opponent",
        Description = "Gather quiet intel on the opponent's setup for a small edge.",
        IsShady = true,
        IsMatchScoped = true,
        MinConnections = 2
      },
      new()
      {
        Type = ClubActionType.EspionageII,
        Category = ClubActionCategory.Match,
        DisplayName = "Deep Cover Scout",
        Description = "A deeper intel push for a stronger match-day edge. Unlocked at high Infamy.",
        IsShady = true,
        IsMatchScoped = true,
        MinCunning = 3,
        RequiresShadyTierII = true
      },
      new()
      {
        Type = ClubActionType.Sabotage,
        Category = ClubActionCategory.Match,
        DisplayName = "Disrupt Away Prep",
        Description = "Make travel and rest harder for the visitors. Only available when you are the home club.",
        IsShady = true,
        IsMatchScoped = true,
        MinAuthority = 2
      },
      new()
      {
        Type = ClubActionType.IntimidateReferee,
        Category = ClubActionCategory.Match,
        DisplayName = "Pressure the Official",
        Description = "Apply off-pitch pressure for friendlier decisions. Can backfire against strict or showman officials.",
        IsShady = true,
        IsMatchScoped = true,
        MinAuthority = 2
      },
      new()
      {
        Type = ClubActionType.TeamBonding,
        Category = ClubActionCategory.Squad,
        DisplayName = "Team Bonding",
        Description = "Organize a squad event to build chemistry. Small discipline risk.",
        IsShady = false,
        MinCharisma = 2
      },
      new()
      {
        Type = ClubActionType.FinePlayer,
        Category = ClubActionCategory.Squad,
        DisplayName = "Fine a Player",
        Description = "Discipline the squad. Improves discipline at the cost of morale.",
        IsShady = false,
        MinAuthority = 2
      },
      new()
      {
        Type = ClubActionType.MotivationalTalk,
        Category = ClubActionCategory.Squad,
        DisplayName = "Motivational Talk",
        Description = "Rally the squad to lift morale.",
        IsShady = false,
        MinCharisma = 2
      },
      new()
      {
        Type = ClubActionType.BrutalTraining,
        Category = ClubActionCategory.Squad,
        DisplayName = "Brutal Training Week",
        Description = "Push the squad hard for short-term sharpness (discipline) at the cost of morale.",
        IsShady = false,
        MinAuthority = 2
      },
      new()
      {
        Type = ClubActionType.PromiseWinBonus,
        Category = ClubActionCategory.Squad,
        DisplayName = "Promise Win Bonus",
        Description = "Promise a cash bonus for the next fixture to raise morale now. Paid only if you win.",
        IsShady = false
      },
      new()
      {
        Type = ClubActionType.MediaSpin,
        Category = ClubActionCategory.Politics,
        DisplayName = "Shape the Narrative",
        Description = "Steer the press to unsettle the next opponent's morale, or repair your own standing.",
        IsShady = true,
        MinCharisma = 2
      },
      new()
      {
        Type = ClubActionType.LobbyFederation,
        Category = ClubActionCategory.Politics,
        DisplayName = "Federation Favor",
        Description = "Spend standing to cool federation scrutiny of your club.",
        IsShady = true,
        MinConnections = 2
      },
      new()
      {
        Type = ClubActionType.DodgySponsorship,
        Category = ClubActionCategory.Politics,
        DisplayName = "Shadow Sponsor Deal",
        Description = "Unlock fast cash through an off-books sponsor. High exposure risk.",
        IsShady = true,
        MinCunning = 3
      },
      new()
      {
        Type = ClubActionType.TapUpTarget,
        Category = ClubActionCategory.Politics,
        DisplayName = "Private Approach",
        Description = "Quietly sound out a transfer target to unlock a fee discount if you buy them.",
        IsShady = true,
        MinConnections = 2
      },
      new()
      {
        Type = ClubActionType.TapUpTargetII,
        Category = ClubActionCategory.Politics,
        DisplayName = "Hard Tap",
        Description = "A bolder private approach for a larger transfer fee discount. Unlocked at high Infamy.",
        IsShady = true,
        MinCunning = 4,
        RequiresShadyTierII = true
      },
      new()
      {
        Type = ClubActionType.CommunityDay,
        Category = ClubActionCategory.Politics,
        DisplayName = "Community Day",
        Description = "Host a public club event to lift morale and chemistry. Honorable Power.",
        IsShady = false,
        MinCharisma = 3,
        MinLegitimacy = ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold
      },
      new()
      {
        Type = ClubActionType.AcademyPush,
        Category = ClubActionCategory.Politics,
        DisplayName = "Academy Push",
        Description = "Invest in youth pathways to sharpen discipline and squad chemistry. Honorable Power.",
        IsShady = false,
        MinIntegrity = 3,
        MinLegitimacy = ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold
      },
      new()
      {
        Type = ClubActionType.FairPlayPledge,
        Category = ClubActionCategory.Politics,
        DisplayName = "Fair Play Pledge",
        Description = "Publicly commit to clean competition. Blocks gray-area moves for a short period. Honorable Power.",
        IsShady = false,
        MinIntegrity = 4,
        MinLegitimacy = ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold
      },
      new()
      {
        Type = ClubActionType.CleanMediaCampaign,
        Category = ClubActionCategory.Politics,
        DisplayName = "Clean Media Campaign",
        Description = "Run a positive press tour to cool scrutiny and rebuild standing. Honorable Power.",
        IsShady = false,
        MinCharisma = 3,
        MinLegitimacy = ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold
      },
      new()
      {
        Type = ClubActionType.FederationAlly,
        Category = ClubActionCategory.Politics,
        DisplayName = "Federation Ally",
        Description = "Leverage clean federation ties to reduce heat without shady favors. Honorable Power.",
        IsShady = false,
        MinConnections = 3,
        MinLegitimacy = ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold
      }
    }.ToDictionary(d => d.Type);

  public static IReadOnlyCollection<ClubActionMetadata> All => (IReadOnlyCollection<ClubActionMetadata>)_metadata.Values;

  public static ClubActionMetadata Get(ClubActionType type)
  {
    if (_metadata.TryGetValue(type, out ClubActionMetadata? metadata))
    {
      return metadata;
    }

    throw new NotFoundException($"{type} aksiyon tanımı bulunamadı.");
  }
}
