namespace Api.Features.LeaguePress;

public enum LeaguePressEventType
{
  ScandalDetected = 1,
  ClubLifePositive = 2,
  MatchFinished = 3
}

public sealed record LeaguePressEvent(
  LeaguePressEventType EventType,
  Guid? ClubActionId = null,
  Guid? BribeAttemptId = null,
  Guid? MatchId = null);

public interface ILeaguePressEventPublisher
{
  Task PublishAsync(LeaguePressEvent leaguePressEvent, CancellationToken cancellationToken = default);
}

public class LeaguePressEventPublisher(LeaguePressArticleGenerator _articleGenerator) : ILeaguePressEventPublisher
{
  public async Task PublishAsync(
    LeaguePressEvent leaguePressEvent,
    CancellationToken cancellationToken = default)
  {
    switch (leaguePressEvent.EventType)
    {
      case LeaguePressEventType.ScandalDetected:
        if (leaguePressEvent.ClubActionId.HasValue)
        {
          await _articleGenerator.TryGenerateScandalFromActionAsync(
            leaguePressEvent.ClubActionId.Value,
            cancellationToken);
        }
        else if (leaguePressEvent.BribeAttemptId.HasValue)
        {
          await _articleGenerator.TryGenerateScandalFromBribeAsync(
            leaguePressEvent.BribeAttemptId.Value,
            cancellationToken);
        }

        break;

      case LeaguePressEventType.ClubLifePositive:
        if (leaguePressEvent.ClubActionId.HasValue)
        {
          await _articleGenerator.TryGenerateClubLifeFromActionAsync(
            leaguePressEvent.ClubActionId.Value,
            cancellationToken);
        }

        break;

      case LeaguePressEventType.MatchFinished:
        if (leaguePressEvent.MatchId.HasValue)
        {
          await _articleGenerator.TryGenerateMatchReportAsync(
            leaguePressEvent.MatchId.Value,
            cancellationToken);
        }

        break;
    }
  }
}
