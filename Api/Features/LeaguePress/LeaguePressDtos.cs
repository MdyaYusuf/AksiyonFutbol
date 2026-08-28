namespace Api.Features.LeaguePress;

public sealed class NewsArticleDto
{
  public Guid Id { get; init; }
  public int DivisionId { get; init; }
  public int Season { get; init; }
  public int? MatchWeek { get; init; }
  public Guid? SubjectClubId { get; init; }
  public string? SubjectClubName { get; init; }
  public NewsArticleKind Kind { get; init; }
  public NewsArticleTone Tone { get; init; }
  public string Headline { get; init; } = default!;
  public string Body { get; init; } = default!;
  public DateTime CreatedDate { get; init; }
}
