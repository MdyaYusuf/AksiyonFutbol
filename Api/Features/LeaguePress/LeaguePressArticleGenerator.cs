using System.Text.Json;
using Api.Core.Options;
using Api.Features.Actions;
using Api.Features.Bribery;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.Matches;
using Api.Features.SeasonTransitions;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.LeaguePress;

public class LeaguePressArticleGenerator(
  INewsArticleRepository _newsArticleRepository,
  IClubActionRepository _clubActionRepository,
  IBribeAttemptRepository _bribeAttemptRepository,
  IMatchRepository _matchRepository,
  IClubRepository _clubRepository)
{
  private static readonly JsonSerializerOptions MatchLogJsonOptions = new()
  {
    PropertyNameCaseInsensitive = true
  };

  public async Task TryGenerateScandalFromActionAsync(
    Guid clubActionId,
    CancellationToken cancellationToken = default)
  {
    if (await _newsArticleRepository.AnyAsync(
          a => a.SourceClubActionId == clubActionId,
          cancellationToken))
    {
      return;
    }

    ClubAction? action = await _clubActionRepository.GetByIdAsync(
      clubActionId,
      include: query => query
        .Include(a => a.Club)
          .ThenInclude(c => c.President)
        .Include(a => a.Club)
          .ThenInclude(c => c.Division)
        .Include(a => a.Match),
      cancellationToken: cancellationToken);

    if (action == null || !action.WasDetected)
    {
      return;
    }

    Club club = action.Club;

    if (!club.DivisionId.HasValue)
    {
      return;
    }

    int infamy = club.President?.InfamyPoints ?? 0;
    int severity = LeaguePressBusinessRules.CalculateScandalSeverityScore(club.Suspicion, infamy);
    NewsArticleTone tone = LeaguePressBusinessRules.ResolveScandalTone(severity);
    string softenedTopic = LeaguePressTemplates.SoftenActionTopic(action.ActionType);
    (string headline, string body) = LeaguePressTemplates.BuildActionScandalCopy(
      club.DisplayName,
      softenedTopic,
      tone,
      action.Match?.MatchWeek);

    NewsArticle article = new()
    {
      DivisionId = club.DivisionId.Value,
      Season = action.Match?.Season ?? club.Division?.CurrentSeason ?? 1,
      MatchWeek = action.Match?.MatchWeek,
      SubjectClubId = club.Id,
      Kind = NewsArticleKind.Scandal,
      Tone = tone,
      Headline = headline,
      Body = body,
      SourceClubActionId = clubActionId
    };

    await _newsArticleRepository.AddAsync(article, cancellationToken);
  }

  public async Task TryGenerateScandalFromBribeAsync(
    Guid bribeAttemptId,
    CancellationToken cancellationToken = default)
  {
    if (await _newsArticleRepository.AnyAsync(
          a => a.SourceBribeAttemptId == bribeAttemptId,
          cancellationToken))
    {
      return;
    }

    BribeAttempt? attempt = await _bribeAttemptRepository.GetByIdAsync(
      bribeAttemptId,
      include: query => query
        .Include(a => a.Club)
          .ThenInclude(c => c.President)
        .Include(a => a.Match),
      cancellationToken: cancellationToken);

    if (attempt == null || !attempt.WasDetected)
    {
      return;
    }

    Club club = attempt.Club;

    if (!club.DivisionId.HasValue)
    {
      return;
    }

    int infamy = club.President?.InfamyPoints ?? 0;
    int severity = LeaguePressBusinessRules.CalculateScandalSeverityScore(club.Suspicion, infamy);
    NewsArticleTone tone = LeaguePressBusinessRules.ResolveScandalTone(severity);
    (string headline, string body) = LeaguePressTemplates.BuildBriberyScandalCopy(
      club.DisplayName,
      tone,
      attempt.Match.MatchWeek);

    NewsArticle article = new()
    {
      DivisionId = club.DivisionId.Value,
      Season = attempt.Match.Season,
      MatchWeek = attempt.Match.MatchWeek,
      SubjectClubId = club.Id,
      Kind = NewsArticleKind.Scandal,
      Tone = tone,
      Headline = headline,
      Body = body,
      SourceBribeAttemptId = bribeAttemptId
    };

    await _newsArticleRepository.AddAsync(article, cancellationToken);
  }

  public async Task TryGenerateClubLifeFromActionAsync(
    Guid clubActionId,
    CancellationToken cancellationToken = default)
  {
    if (await _newsArticleRepository.AnyAsync(
          a => a.SourceClubActionId == clubActionId,
          cancellationToken))
    {
      return;
    }

    ClubAction? action = await _clubActionRepository.GetByIdAsync(
      clubActionId,
      include: query => query
        .Include(a => a.Club)
          .ThenInclude(c => c.Division)
        .Include(a => a.Match),
      cancellationToken: cancellationToken);

    if (action == null || action.Outcome != ClubActionOutcome.Succeeded)
    {
      return;
    }

    ClubActionMetadata metadata = ClubActionCatalog.Get(action.ActionType);

    if (!QualifiesForClubLifeArticle(metadata))
    {
      return;
    }

    Club club = action.Club;

    if (!club.DivisionId.HasValue)
    {
      return;
    }

    (string headline, string body) = LeaguePressTemplates.BuildClubLifeCopy(
      action.ActionType,
      club.DisplayName);

    NewsArticle article = new()
    {
      DivisionId = club.DivisionId.Value,
      Season = action.Match?.Season ?? club.Division?.CurrentSeason ?? 1,
      MatchWeek = action.Match?.MatchWeek,
      SubjectClubId = club.Id,
      Kind = NewsArticleKind.ClubLife,
      Tone = NewsArticleTone.Positive,
      Headline = headline,
      Body = body,
      SourceClubActionId = clubActionId
    };

    await _newsArticleRepository.AddAsync(article, cancellationToken);
  }

  public async Task TryGeneratePlacementLeaguePackAsync(
    int divisionId,
    string divisionName,
    Club humanClub,
    IReadOnlyList<Club> botClubs,
    GameOptions options,
    CancellationToken cancellationToken = default)
  {
    if (await _newsArticleRepository.AnyAsync(
          a => a.DivisionId == divisionId && a.Kind == NewsArticleKind.Placement,
          cancellationToken))
    {
      return;
    }

    string presidentName = humanClub.President?.Name ?? "the new president";
    int season = 1;
    DateTime publishedAt = DateTime.UtcNow;

    List<(string Headline, string Body, Guid? SubjectClubId)> copyItems = [];

    (string welcomeHeadline, string welcomeBody) = LeaguePressTemplates.BuildPlacementWelcomeCopy(
      divisionName,
      humanClub.DisplayName,
      presidentName);
    copyItems.Add((welcomeHeadline, welcomeBody, humanClub.Id));

    (string rulesHeadline, string rulesBody) = LeaguePressTemplates.BuildPlacementRulesCopy(
      divisionName,
      options);
    copyItems.Add((rulesHeadline, rulesBody, null));

    int botArticleCount = Math.Min(3, botClubs.Count);

    for (int i = 0; i < botArticleCount; i++)
    {
      Club botClub = botClubs[i];
      (string headline, string body) = LeaguePressTemplates.BuildPlacementBotPrepCopy(
        botClub.DisplayName,
        i);

      copyItems.Add((headline, body, botClub.Id));
    }

    for (int i = 0; i < copyItems.Count; i++)
    {
      (string headline, string body, Guid? subjectClubId) = copyItems[i];

      NewsArticle article = new()
      {
        DivisionId = divisionId,
        Season = season,
        MatchWeek = null,
        SubjectClubId = subjectClubId,
        Kind = NewsArticleKind.Placement,
        Tone = NewsArticleTone.Neutral,
        Headline = headline,
        Body = body,
        CreatedDate = publishedAt.AddMinutes(-(copyItems.Count - 1 - i))
      };

      await _newsArticleRepository.AddAsync(article, cancellationToken);
    }
  }

  public async Task TryGenerateMatchReportAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    if (await _newsArticleRepository.AnyAsync(
          a => a.SourceMatchId == matchId,
          cancellationToken))
    {
      return;
    }

    Match? match = await _matchRepository.GetByIdAsync(
      matchId,
      include: query => query
        .Include(m => m.HomeClub)
        .Include(m => m.AwayClub),
      cancellationToken: cancellationToken);

    if (match == null || !match.IsPlayed || !match.HomeScore.HasValue || !match.AwayScore.HasValue)
    {
      return;
    }

    List<string> goalSummaries = ParseGoalSummaries(match.MatchLogJson);
    (int? homePosition, int? awayPosition) = await ResolveTablePositionsAsync(match, cancellationToken);
    string standingsSentence = LeaguePressTemplates.BuildStandingsSentence(
      match.HomeClub.DisplayName,
      homePosition,
      match.AwayClub.DisplayName,
      awayPosition);

    (string headline, string body) = LeaguePressTemplates.BuildMatchReportCopy(
      match.HomeClub.DisplayName,
      match.AwayClub.DisplayName,
      match.HomeScore.Value,
      match.AwayScore.Value,
      match.MatchWeek,
      goalSummaries,
      standingsSentence);

    NewsArticle article = new()
    {
      DivisionId = match.DivisionId,
      Season = match.Season,
      MatchWeek = match.MatchWeek,
      SubjectClubId = null,
      Kind = NewsArticleKind.MatchReport,
      Tone = NewsArticleTone.Neutral,
      Headline = headline,
      Body = body,
      SourceMatchId = matchId
    };

    await _newsArticleRepository.AddAsync(article, cancellationToken);
  }

  private async Task<(int? HomePosition, int? AwayPosition)> ResolveTablePositionsAsync(
    Match match,
    CancellationToken cancellationToken)
  {
    List<Club> clubs = await _clubRepository.GetAllAsync(
      filter: c => c.DivisionId == match.DivisionId,
      cancellationToken: cancellationToken);

    List<Match> matches = await _matchRepository.GetAllAsync(
      filter: m => m.DivisionId == match.DivisionId && m.Season == match.Season,
      cancellationToken: cancellationToken);

    IReadOnlyList<StandingRowDto> standings = SeasonStandingsCalculator.BuildStandings(
      clubs,
      matches,
      match.DivisionId);

    int? homePosition = standings
      .FirstOrDefault(row => row.ClubId == match.HomeClubId)
      ?.Position;

    int? awayPosition = standings
      .FirstOrDefault(row => row.ClubId == match.AwayClubId)
      ?.Position;

    return (homePosition, awayPosition);
  }

  private static List<string> ParseGoalSummaries(string? matchLogJson)
  {
    if (string.IsNullOrWhiteSpace(matchLogJson))
    {
      return [];
    }

    try
    {
      List<MatchEventDto>? events = JsonSerializer.Deserialize<List<MatchEventDto>>(
        matchLogJson,
        MatchLogJsonOptions);

      if (events == null)
      {
        return [];
      }

      return events
        .Where(e => e.Type == MatchEventType.Goal)
        .OrderBy(e => e.Minute)
        .Select(e => $"{e.Minute}' {e.Description}")
        .ToList();
    }
    catch (JsonException)
    {
      return [];
    }
  }

  internal static bool QualifiesForClubLifeArticle(ClubActionMetadata metadata)
  {
    if (metadata.IsShady)
    {
      return false;
    }

    if (metadata.Category == ClubActionCategory.Squad)
    {
      return metadata.Type is ClubActionType.TeamBonding or ClubActionType.MotivationalTalk;
    }

    if (metadata.Category == ClubActionCategory.Politics &&
        metadata.MinLegitimacy >= ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold)
    {
      return true;
    }

    return false;
  }
}
