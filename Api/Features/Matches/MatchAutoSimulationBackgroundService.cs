using Api.Core.Options;
using Microsoft.Extensions.Options;

namespace Api.Features.Matches;

public sealed class MatchAutoSimulationBackgroundService(
  IServiceScopeFactory _scopeFactory,
  IOptionsMonitor<GameOptions> _gameOptions,
  ILogger<MatchAutoSimulationBackgroundService> _logger) : BackgroundService
{
  private const int BatchSize = 10;

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    int pollSeconds = Math.Max(1, _gameOptions.CurrentValue.MatchAutoSimulatePollSeconds);
    using PeriodicTimer timer = new(TimeSpan.FromSeconds(pollSeconds));

    _logger.LogInformation(
      "Match auto-simulation worker started. Poll interval: {PollSeconds}s. Batch size: {BatchSize}.",
      pollSeconds,
      BatchSize);

    // Process due matches immediately so kickoff after restart is not delayed by one full poll.
    await RunTickSafelyAsync(stoppingToken);

    while (await timer.WaitForNextTickAsync(stoppingToken))
    {
      await RunTickSafelyAsync(stoppingToken);
    }
  }

  private async Task RunTickSafelyAsync(CancellationToken stoppingToken)
  {
    try
    {
      await ProcessDueMatchesAsync(stoppingToken);
    }
    catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
    {
      // Shutting down — let ExecuteAsync exit.
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Match auto-simulation tick failed.");
    }
  }

  private async Task ProcessDueMatchesAsync(CancellationToken cancellationToken)
  {
    await using AsyncServiceScope scope = _scopeFactory.CreateAsyncScope();
    IMatchRepository matchRepository = scope.ServiceProvider.GetRequiredService<IMatchRepository>();
    IMatchPlayService matchPlayService = scope.ServiceProvider.GetRequiredService<IMatchPlayService>();

    List<Match> dueMatches = await matchRepository.GetDuePlayableAsync(
      DateTime.UtcNow,
      BatchSize,
      include: MatchPlayService.IncludeMatchRelations,
      enableTracking: false,
      cancellationToken: cancellationToken);

    if (dueMatches.Count == 0)
    {
      return;
    }

    _logger.LogInformation(
      "Match auto-simulation found {Count} due match(es).",
      dueMatches.Count);

    foreach (Match dueMatch in dueMatches)
    {
      cancellationToken.ThrowIfCancellationRequested();

      try
      {
        await matchPlayService.PlayAndPersistAsync(dueMatch.Id, cancellationToken);
        _logger.LogInformation(
          "Auto-simulated match {MatchId}: {Home} vs {Away}.",
          dueMatch.Id,
          dueMatch.HomeClub?.DisplayName ?? dueMatch.HomeClubId.ToString(),
          dueMatch.AwayClub?.DisplayName ?? dueMatch.AwayClubId.ToString());
      }
      catch (Exception ex)
      {
        _logger.LogWarning(
          ex,
          "Skipped auto-simulation for match {MatchId} ({Home} vs {Away}).",
          dueMatch.Id,
          dueMatch.HomeClub?.DisplayName ?? dueMatch.HomeClubId.ToString(),
          dueMatch.AwayClub?.DisplayName ?? dueMatch.AwayClubId.ToString());
      }
    }
  }
}
