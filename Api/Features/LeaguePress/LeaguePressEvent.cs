namespace Api.Features.LeaguePress;

/// <summary>
/// Lightweight hook for Phase 5 League Press. Publishers are no-ops until the feed exists.
/// </summary>
public enum LeaguePressEventType
{
  ScandalDetected = 1
}

public sealed record LeaguePressEvent(
  LeaguePressEventType EventType,
  Guid ClubId,
  Guid? MatchId,
  string SummaryKey);

public interface ILeaguePressEventPublisher
{
  Task PublishAsync(LeaguePressEvent leaguePressEvent, CancellationToken cancellationToken = default);
}

public class NullLeaguePressEventPublisher : ILeaguePressEventPublisher
{
  public Task PublishAsync(LeaguePressEvent leaguePressEvent, CancellationToken cancellationToken = default)
  {
    return Task.CompletedTask;
  }
}
