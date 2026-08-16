namespace Api.Features.Matches;

public static class GameLocalClock
{
  private static readonly TimeZoneInfo GameTimeZone = ResolveGameTimeZone();

  public static TimeZoneInfo TimeZone => GameTimeZone;

  public static DateTime ConvertLocalToUtc(DateTime matchDate)
  {
    if (matchDate.Kind == DateTimeKind.Utc)
    {
      return matchDate;
    }

    DateTime gameLocalDate = DateTime.SpecifyKind(matchDate, DateTimeKind.Unspecified);
    return TimeZoneInfo.ConvertTimeToUtc(gameLocalDate, GameTimeZone);
  }

  public static DateTime ConvertUtcToLocal(DateTime utcDate)
  {
    DateTime utc = utcDate.Kind == DateTimeKind.Utc
      ? utcDate
      : DateTime.SpecifyKind(utcDate, DateTimeKind.Utc);

    return TimeZoneInfo.ConvertTimeFromUtc(utc, GameTimeZone);
  }

  /// <summary>
  /// Next calendar kickoff at <paramref name="kickoffLocalTime"/> on or after <paramref name="utcNow"/>
  /// in Europe/Istanbul (Unspecified Kind for ConvertLocalToUtc).
  /// </summary>
  public static DateTime GetNextKickoffLocal(DateTime utcNow, TimeSpan kickoffLocalTime)
  {
    DateTime localNow = ConvertUtcToLocal(utcNow);
    DateTime candidate = DateTime.SpecifyKind(localNow.Date + kickoffLocalTime, DateTimeKind.Unspecified);

    if (localNow <= candidate)
    {
      return candidate;
    }

    return DateTime.SpecifyKind(candidate.AddDays(1), DateTimeKind.Unspecified);
  }

  private static TimeZoneInfo ResolveGameTimeZone()
  {
    string timeZoneId = OperatingSystem.IsWindows()
      ? "Turkey Standard Time"
      : "Europe/Istanbul";

    return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
  }
}
