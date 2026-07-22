using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Clubs;
using Api.Features.Matches;
using Api.Features.Referees;

namespace Api.Features.Bribery;

public class BribeAttempt : Entity<Guid>
{
  [SetsRequiredMembers]
  public BribeAttempt()
  {
    Outcome = BribeAttemptOutcome.Failed;
  }

  public decimal Amount { get; set; }
  public decimal SuccessChance { get; set; }
  public BribeAttemptOutcome Outcome { get; set; }

  public Guid ClubId { get; set; }
  public Guid MatchId { get; set; }
  public int RefereeId { get; set; }

  public virtual Club Club { get; set; } = default!;
  public virtual Match Match { get; set; } = default!;
  public virtual Referee Referee { get; set; } = default!;
}
