namespace Api.Features.Matches;

public interface IMatchPlayService
{
  /// <summary>
  /// Loads an unplayed match, simulates it, and persists the result.
  /// </summary>
  Task<Match> PlayAndPersistAsync(Guid matchId, CancellationToken cancellationToken = default);

  /// <summary>
  /// Simulates an already-tracked match in place. Caller owns SaveChanges.
  /// </summary>
  Task SimulateInPlaceAsync(Match match, CancellationToken cancellationToken = default);
}
