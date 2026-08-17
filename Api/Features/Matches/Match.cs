using Api.Core.Entities;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Referees;

namespace Api.Features.Matches;

public class Match : Entity<Guid>
{
  public int MatchWeek { get; set; }
  public int Season { get; set; }
  public DateTime MatchDate { get; set; }
  public bool IsPlayed { get; set; }
  public int? HomeScore { get; set; }
  public int? AwayScore { get; set; }
  public string? MatchLogJson { get; set; }

  // Pre-sim club stats so GETs can hide settlement until the live window ends.
  public decimal? HomeCashBefore { get; set; }
  public decimal? AwayCashBefore { get; set; }
  public int? HomeMoraleBefore { get; set; }
  public int? AwayMoraleBefore { get; set; }
  public int? HomeSuspicionBefore { get; set; }
  public int? AwaySuspicionBefore { get; set; }

  // Relationship properties
  public int DivisionId { get; set; }
  public Guid HomeClubId { get; set; }
  public Guid AwayClubId { get; set; }
  public int? RefereeId { get; set; }
  public virtual LeagueDivision Division { get; set; } = default!;
  public virtual Club HomeClub { get; set; } = default!;
  public virtual Club AwayClub { get; set; } = default!;
  public virtual Referee? Referee { get; set; }
}
