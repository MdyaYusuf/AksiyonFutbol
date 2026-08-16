using Api.Features.Matches;

namespace Api.Features.CompetitiveSeating;

public interface ITutorialGraduationService
{
  /// <summary>
  /// When the last tutorial fixture is played, queues human clubs for Monday seating
  /// and seals the division. Does not call SaveChanges.
  /// </summary>
  Task TryGraduateAfterMatchAsync(Match match, CancellationToken cancellationToken = default);
}
