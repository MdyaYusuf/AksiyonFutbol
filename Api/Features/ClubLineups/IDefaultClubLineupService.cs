namespace Api.Features.ClubLineups;

public interface IDefaultClubLineupService
{
  /// <summary>
  /// Creates a default 4-3-3 / Balanced lineup when the club has none.
  /// Does not call SaveChanges; the caller owns the unit-of-work commit.
  /// </summary>
  Task EnsureAsync(Guid clubId, CancellationToken cancellationToken = default);
}
