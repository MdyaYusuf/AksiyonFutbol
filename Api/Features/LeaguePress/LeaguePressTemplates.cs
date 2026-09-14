using Api.Core.Options;
using Api.Features.Actions;

namespace Api.Features.LeaguePress;

public static class LeaguePressTemplates
{
  public static string SoftenActionTopic(ClubActionType type)
  {
    return type switch
    {
      ClubActionType.MatchFixing => "fixture irregularities",
      ClubActionType.Doping => "questionable preparation methods",
      ClubActionType.Espionage => "opposition intelligence gathering",
      ClubActionType.EspionageII => "deep opposition intelligence work",
      ClubActionType.Sabotage => "disruption around away-day preparation",
      ClubActionType.IntimidateReferee => "pressure around match officials",
      ClubActionType.MediaSpin => "aggressive narrative shaping",
      ClubActionType.LobbyFederation => "back-channel federation lobbying",
      ClubActionType.DodgySponsorship => "opaque sponsorship arrangements",
      ClubActionType.TapUpTarget => "unauthorized player contact",
      ClubActionType.TapUpTargetII => "persistent unauthorized player contact",
      ClubActionType.BrutalTraining => "extreme training demands",
      _ => "off-field conduct"
    };
  }

  public static (string Headline, string Body) BuildActionScandalCopy(
    string clubName,
    string softenedTopic,
    NewsArticleTone tone,
    int? matchWeek)
  {
    string weekPhrase = matchWeek.HasValue
      ? $" ahead of match week {matchWeek.Value}"
      : string.Empty;

    return tone switch
    {
      NewsArticleTone.Sensational => (
        $"{clubName} rocked by division probe",
        $"League insiders say investigators are circling {clubName} over alleged {softenedTopic}{weekPhrase}. " +
        "Sources close to the federation describe the file as \"active\" and expect a formal update soon."),
      NewsArticleTone.Critical => (
        $"Questions mount around {clubName}",
        $"{clubName} face renewed scrutiny after reports linked the club to {softenedTopic}{weekPhrase}. " +
        "The division desk has not confirmed sanctions, but rival presidents are already briefing the press."),
      _ => (
        $"{clubName} on the gossip pages",
        $"Whispers around the division suggest {clubName} may have crossed a line with {softenedTopic}{weekPhrase}. " +
        "Nothing is proven yet, but the story is gaining traction in the corridors.")
    };
  }

  public static (string Headline, string Body) BuildBriberyScandalCopy(
    string clubName,
    NewsArticleTone tone,
    int matchWeek)
  {
    return tone switch
    {
      NewsArticleTone.Sensational => (
        $"Referee liaison storm engulfs {clubName}",
        $"Match week {matchWeek} will be remembered for the wrong reasons as {clubName} " +
        "are linked to improper contact around the officiating team. The league desk calls the allegations \"serious\"."),
      NewsArticleTone.Critical => (
        $"{clubName} drawn into officiating controversy",
        $"Reporters chasing the week {matchWeek} fixture card claim {clubName} " +
        "are under review for conduct toward match officials. Club spokespeople declined to comment."),
      _ => (
        $"Officials watchlist note on {clubName}",
        $"A quiet file on {clubName}'s match-week {matchWeek} preparations has surfaced in division circles, " +
        "with questions about how close the club got to the refereeing appointment.")
    };
  }

  public static (string Headline, string Body) BuildClubLifeCopy(
    ClubActionType type,
    string clubName)
  {
    return type switch
    {
      ClubActionType.TeamBonding => (
        $"{clubName} lean into squad unity",
        $"{clubName} staged a bonding session that players described as \"exactly what we needed.\" " +
        "Local reporters framed it as the kind of culture work that wins tight weeks."),
      ClubActionType.MotivationalTalk => (
        $"{clubName} president rallies the dressing room",
        $"A pointed team talk from the {clubName} boardroom set the tone for the week. " +
        "Staff say the message was direct, optimistic, and unusually personal."),
      ClubActionType.CommunityDay => (
        $"{clubName} open their doors to the city",
        $"{clubName} hosted a community day that drew families, youth coaches, and civic leaders. " +
        "The club's press team pitched it as football doing its proper job off the pitch."),
      ClubActionType.AcademyPush => (
        $"{clubName} double down on youth",
        $"{clubName} announced a fresh academy push, with first-team coaches visiting the youth setup this week. " +
        "The local paper called it a statement of long-term intent."),
      ClubActionType.FairPlayPledge => (
        $"{clubName} sign fair-play charter",
        $"{clubName} publicly backed a fair-play pledge, promising cleaner conduct on and off the field. " +
        "Rival clubs noticed, some approvingly, others with a raised eyebrow."),
      ClubActionType.CleanMediaCampaign => (
        $"{clubName} reset the narrative",
        $"{clubName} launched a clean media campaign aimed at rebuilding trust with supporters and sponsors. " +
        "Analysts say the messaging is sharper and more transparent than last season."),
      ClubActionType.FederationAlly => (
        $"{clubName} strengthen federation ties",
        $"{clubName} were seen at federation events this week, signalling a warmer relationship with league stewards. " +
        "Insiders describe it as diplomatic groundwork rather than flashy politics."),
      _ => (
        $"{clubName} make positive headlines",
        $"{clubName} generated feel-good coverage around the division this week, " +
        "with staff and supporters welcoming a rare stretch of upbeat press.")
    };
  }

  public static (string Headline, string Body) BuildPlacementWelcomeCopy(
    string divisionName,
    string clubName,
    string presidentName)
  {
    return (
      $"{clubName} enter the placement league",
      $"President {presidentName} has formally registered {clubName} in {divisionName}. " +
      "The division desk welcomes the newest boardroom on the block and notes that every rival " +
      "club in this cohort is still finding its feet. The table is wide open from week one.");
  }

  public static (string Headline, string Body) BuildPlacementRulesCopy(
    string divisionName,
    GameOptions options)
  {
    return (
      "Placement desk publishes graduation bands",
      $"{divisionName} will run for {options.TutorialMatchWeeks} match weeks. " +
      "Points at the final whistle decide where clubs graduate: " +
      $"Gold ({options.GraduationGoldMinPoints} to {options.GraduationGoldMaxPoints} pts), " +
      $"Silver ({options.GraduationSilverMinPoints} to {options.GraduationSilverMaxPoints}), " +
      $"Bronze ({options.GraduationBronzeMinPoints} to {options.GraduationBronzeMaxPoints}), " +
      $"or Iron ({options.GraduationIronMinPoints} to {options.GraduationIronMaxPoints}). " +
      "The league office says there are no second chances. Finish strong or carry the label into competitive football.");
  }

  public static (string Headline, string Body) BuildPlacementBotPrepCopy(
    string botClubName,
    int flavorIndex)
  {
    return flavorIndex switch
    {
      0 => (
        $"{botClubName} squad already in training camp",
        $"Staff at {botClubName} spent the opening days running shape drills and set-piece reps. " +
        "Local reporters describe a disciplined, slightly paranoid camp, the kind that treats every placement week as a job interview."),
      1 => (
        $"{botClubName} board talk up \"statement season\"",
        $"Insiders around {botClubName} briefed journalists on ambition without naming targets. " +
        "The message was familiar placement-league rhetoric: prove yourself early or spend the run-in explaining missed chances."),
      _ => (
        $"{botClubName} keep cards close to chest",
        $"Training ground access at {botClubName} has been limited, but fitness reports suggest a fully committed squad. " +
        "Rival presidents mutter that the quiet clubs are often the ones that surprise you on match week one.")
    };
  }

  public static (string Headline, string Body) BuildMatchReportCopy(
    string homeClubName,
    string awayClubName,
    int homeScore,
    int awayScore,
    int matchWeek,
    IReadOnlyList<string> goalSummaries,
    string standingsSentence)
  {
    string headline = $"{homeClubName} {homeScore}-{awayScore} {awayClubName}";

    string scorerLine = goalSummaries.Count > 0
      ? $" Goal timeline: {string.Join("; ", goalSummaries)}."
      : string.Empty;

    string body =
      $"Match week {matchWeek} delivered {headline} in a result that reshuffled talking points around the division." +
      scorerLine +
      $" {standingsSentence}";

    return (headline, body);
  }

  public static string BuildStandingsSentence(
    string homeClubName,
    int? homePosition,
    string awayClubName,
    int? awayPosition)
  {
    if (!homePosition.HasValue && !awayPosition.HasValue)
    {
      return "Table positions will settle once the full week is in.";
    }

    if (homePosition.HasValue && awayPosition.HasValue)
    {
      return $"{homeClubName} sit {Ordinal(homePosition.Value)} while {awayClubName} are {Ordinal(awayPosition.Value)} in the live table.";
    }

    if (homePosition.HasValue)
    {
      return $"{homeClubName} move into {Ordinal(homePosition.Value)} place in the live table.";
    }

    return $"{awayClubName} are {Ordinal(awayPosition!.Value)} after the final whistle.";
  }

  private static string Ordinal(int position)
  {
    int lastTwo = position % 100;
    int last = position % 10;

    if (lastTwo is >= 11 and <= 13)
    {
      return $"{position}th";
    }

    return last switch
    {
      1 => $"{position}st",
      2 => $"{position}nd",
      3 => $"{position}rd",
      _ => $"{position}th"
    };
  }
}
