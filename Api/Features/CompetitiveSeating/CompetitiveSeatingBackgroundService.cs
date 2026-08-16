using Api.Core.Options;
using Api.Features.Matches;
using Microsoft.Extensions.Options;

namespace Api.Features.CompetitiveSeating;

public sealed class CompetitiveSeatingBackgroundService(
  IServiceScopeFactory _scopeFactory,
  IOptionsMonitor<GameOptions> _gameOptions,
  ILogger<CompetitiveSeatingBackgroundService> _logger) : BackgroundService
{
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    int pollSeconds = Math.Max(1, _gameOptions.CurrentValue.MatchAutoSimulatePollSeconds);
    using PeriodicTimer timer = new(TimeSpan.FromSeconds(pollSeconds));

    _logger.LogInformation(
      "Competitive seating worker started. Poll interval: {PollSeconds}s.",
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
      await ProcessSeatingWindowAsync(stoppingToken);
    }
    catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
    {
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Competitive seating tick failed.");
    }
  }

  private async Task ProcessSeatingWindowAsync(CancellationToken cancellationToken)
  {
    GameOptions options = _gameOptions.CurrentValue;
    DateTime localNow = GameLocalClock.ConvertUtcToLocal(DateTime.UtcNow);

    if (localNow.DayOfWeek != DayOfWeek.Monday)
    {
      return;
    }

    if (localNow.TimeOfDay < options.MatchKickoffLocalTime)
    {
      return;
    }

    await using AsyncServiceScope scope = _scopeFactory.CreateAsyncScope();
    ICompetitiveSeatingService seatingService =
      scope.ServiceProvider.GetRequiredService<ICompetitiveSeatingService>();

    int created = await seatingService.SeatQueuedClubsAsync(cancellationToken);

    if (created > 0)
    {
      _logger.LogInformation(
        "Competitive seating created {DivisionCount} division(s).",
        created);
    }
  }
}
