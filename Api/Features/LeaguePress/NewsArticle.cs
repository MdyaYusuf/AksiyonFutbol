using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;

namespace Api.Features.LeaguePress;

public class NewsArticle : Entity<Guid>
{
  [SetsRequiredMembers]
  public NewsArticle()
  {
    Headline = default!;
    Body = default!;
  }

  public int DivisionId { get; set; }
  public int Season { get; set; }
  public int? MatchWeek { get; set; }
  public Guid? SubjectClubId { get; set; }
  public NewsArticleKind Kind { get; set; }
  public NewsArticleTone Tone { get; set; }
  public required string Headline { get; set; }
  public required string Body { get; set; }

  public Guid? SourceMatchId { get; set; }
  public Guid? SourceClubActionId { get; set; }
  public Guid? SourceBribeAttemptId { get; set; }

  public virtual Club? SubjectClub { get; set; }
}
