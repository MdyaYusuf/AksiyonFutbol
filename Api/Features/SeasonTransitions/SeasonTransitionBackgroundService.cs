using Api.Core.Options;
using Api.Features.Matches;
using Microsoft.Extensions.Options;

namespace Api.Features.SeasonTransitions;

public sealed class SeasonTransitionBackgroundService(
  IServiceScopeFactory _scopeFactory,
  IOptionsMonitor<GameOptions> _gameOptions,
  ILogger<SeasonTransitionBackgroundService> _logger) : BackgroundService
{
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    int pollSeconds = Math.Max(1, _gameOptions.CurrentValue.MatchAutoSimulatePollSeconds);
    using PeriodicTimer timer = new(TimeSpan.FromSeconds(pollSeconds));

    _logger.LogInformation(
      "Season transition worker started. Poll interval: {PollSeconds}s.",
      pollSeconds);

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
      await ProcessReadyGroupsAsync(stoppingToken);
    }
    catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
    {
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Season transition tick failed.");
    }
  }

  private async Task ProcessReadyGroupsAsync(CancellationToken cancellationToken)
  {
    await using AsyncServiceScope scope = _scopeFactory.CreateAsyncScope();
    ICompetitiveSeasonEndService seasonEndService =
      scope.ServiceProvider.GetRequiredService<ICompetitiveSeasonEndService>();

    int processed = await seasonEndService.ProcessReadyGroupsAsync(cancellationToken);

    if (processed > 0)
    {
      _logger.LogInformation(
        "Season transition processed {GroupCount} competitive group(s).",
        processed);
    }
  }
}
