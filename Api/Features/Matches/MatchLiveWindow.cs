namespace Api.Features.Matches;

public static class MatchLiveWindow
{
  public const string SpendLockedExceptionMessage =
    "Maçınız devam ederken kasa harcaması yapılamaz.";

  public const string SpendLockedReason = "Unavailable while your match is live.";

  public static DateTime GetLiveEnd(DateTime matchDate, int liveDurationSeconds)
  {
    return matchDate.AddSeconds(liveDurationSeconds);
  }

  public static bool ShouldLockSpend(
    Match match,
    DateTime utcNow,
    int liveDurationSeconds)
  {
    if (utcNow < match.MatchDate)
    {
      return false;
    }

    if (!match.IsPlayed)
    {
      return true;
    }

    return utcNow < GetLiveEnd(match.MatchDate, liveDurationSeconds);
  }

  public static bool ShouldConcealSettlement(
    Match match,
    DateTime utcNow,
    int liveDurationSeconds)
  {
    if (!match.IsPlayed)
    {
      return false;
    }

    return utcNow < GetLiveEnd(match.MatchDate, liveDurationSeconds);
  }

  public static bool ShouldHideScores(
    Match match,
    DateTime utcNow,
    int liveDurationSeconds)
  {
    return ShouldConcealSettlement(match, utcNow, liveDurationSeconds);
  }
}
