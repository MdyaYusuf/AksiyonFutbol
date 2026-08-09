using Api.Core.Exceptions;

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
        DisplayName = "Fix the Match",
        Description = "Pay a key opponent player to underperform in the upcoming fixture.",
        IsShady = true,
        IsMatchScoped = true
      },
      new()
      {
        Type = ClubActionType.Doping,
        Category = ClubActionCategory.Match,
        DisplayName = "Doping Program",
        Description = "Boost your squad for the next match with banned substances.",
        IsShady = true,
        IsMatchScoped = true
      },
      new()
      {
        Type = ClubActionType.Espionage,
        Category = ClubActionCategory.Match,
        DisplayName = "Scout the Opponent",
        Description = "Spy on the opponent to reveal their setup and gain a small edge.",
        IsShady = true,
        IsMatchScoped = true
      },
      new()
      {
        Type = ClubActionType.Sabotage,
        Category = ClubActionCategory.Match,
        DisplayName = "Sabotage the Away Side",
        Description = "Disrupt the opponent's travel and rest to blunt their sharpness.",
        IsShady = true,
        IsMatchScoped = true
      },
      new()
      {
        Type = ClubActionType.IntimidateReferee,
        Category = ClubActionCategory.Match,
        DisplayName = "Intimidate the Referee",
        Description = "Lean on the referee for favorable calls. Backfires with strict officials.",
        IsShady = true,
        IsMatchScoped = true
      },
      new()
      {
        Type = ClubActionType.TeamBonding,
        Category = ClubActionCategory.Squad,
        DisplayName = "Team Bonding",
        Description = "Organize a squad event to build chemistry.",
        IsShady = false
      },
      new()
      {
        Type = ClubActionType.FinePlayer,
        Category = ClubActionCategory.Squad,
        DisplayName = "Fine a Player",
        Description = "Discipline the squad. Improves discipline at the cost of morale.",
        IsShady = false
      },
      new()
      {
        Type = ClubActionType.MotivationalTalk,
        Category = ClubActionCategory.Squad,
        DisplayName = "Motivational Talk",
        Description = "Rally the squad to lift morale.",
        IsShady = false
      },
      new()
      {
        Type = ClubActionType.BrutalTraining,
        Category = ClubActionCategory.Squad,
        DisplayName = "Brutal Training Week",
        Description = "Push the squad hard for short-term sharpness at the cost of morale.",
        IsShady = false
      },
      new()
      {
        Type = ClubActionType.PromiseWinBonus,
        Category = ClubActionCategory.Squad,
        DisplayName = "Promise Win Bonus",
        Description = "Promise a bonus to raise morale now, paid out on a win.",
        IsShady = false
      },
      new()
      {
        Type = ClubActionType.MediaSpin,
        Category = ClubActionCategory.Politics,
        DisplayName = "Media Spin",
        Description = "Work the press to unsettle a rival or repair your reputation.",
        IsShady = true
      },
      new()
      {
        Type = ClubActionType.LobbyFederation,
        Category = ClubActionCategory.Politics,
        DisplayName = "Lobby the Federation",
        Description = "Pull strings at the federation for a favorable outcome.",
        IsShady = true
      },
      new()
      {
        Type = ClubActionType.DodgySponsorship,
        Category = ClubActionCategory.Politics,
        DisplayName = "Dodgy Sponsorship",
        Description = "Inject fast cash through a questionable sponsor. High exposure.",
        IsShady = true
      },
      new()
      {
        Type = ClubActionType.TapUpTarget,
        Category = ClubActionCategory.Politics,
        DisplayName = "Tap Up a Target",
        Description = "Illegally approach a transfer target to lower their asking price.",
        IsShady = true
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
