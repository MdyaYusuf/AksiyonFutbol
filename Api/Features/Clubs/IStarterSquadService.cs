namespace Api.Features.Clubs;

public interface IStarterSquadService
{
  /// <summary>
  /// Selects base-player templates by position and creates player instances for the club.
  /// Expects the club to already be tracked with a generated Id.
  /// Does not call SaveChanges; the caller owns the unit-of-work commit.
  /// </summary>
  Task AssignAsync(Club club, CancellationToken cancellationToken = default);
}
