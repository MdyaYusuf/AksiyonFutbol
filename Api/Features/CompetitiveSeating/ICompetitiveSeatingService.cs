namespace Api.Features.CompetitiveSeating;

public interface ICompetitiveSeatingService
{
  /// <summary>
  /// Packs AwaitingPlacement clubs into competitive 8-team divisions for tiers with a non-empty queue.
  /// </summary>
  Task<int> SeatQueuedClubsAsync(CancellationToken cancellationToken = default);
}
