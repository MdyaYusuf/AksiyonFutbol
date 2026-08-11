using Api.Features.Clubs;

namespace Api.Features.Matches;

public sealed record ClubPublicView(
  decimal Cash,
  int Morale,
  int Suspicion,
  bool CashSpendLocked);

public interface IMatchSettlementGate
{
  Task<ClubPublicView> GetPublicViewAsync(
    Club club,
    CancellationToken cancellationToken = default);

  Task<IReadOnlyDictionary<Guid, ClubPublicView>> GetPublicViewsAsync(
    IReadOnlyList<Club> clubs,
    CancellationToken cancellationToken = default);

  Task MustAllowClubSpendAsync(
    Guid clubId,
    CancellationToken cancellationToken = default);

  void ConcealPreviewScores(IReadOnlyList<Match> matches, List<MatchPreviewDto> previews);

  void ConcealResponseScores(IReadOnlyList<Match> matches, List<MatchResponseDto> responses);

  bool ShouldHideScores(Match match);
}
