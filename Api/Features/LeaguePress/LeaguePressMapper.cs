namespace Api.Features.LeaguePress;

public class LeaguePressMapper
{
  public NewsArticleDto ToDto(NewsArticle article)
  {
    return new NewsArticleDto
    {
      Id = article.Id,
      DivisionId = article.DivisionId,
      Season = article.Season,
      MatchWeek = article.MatchWeek,
      SubjectClubId = article.SubjectClubId,
      SubjectClubName = article.SubjectClub?.DisplayName,
      Kind = article.Kind,
      Tone = article.Tone,
      Headline = article.Headline,
      Body = article.Body,
      CreatedDate = article.CreatedDate
    };
  }
}
