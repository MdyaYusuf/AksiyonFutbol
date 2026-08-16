using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Core.Repositories;
using Api.Features.Referees;
using Microsoft.Extensions.Options;

namespace Api.Features.Matches;

public class FixtureSchedulingService(
  IMatchRepository _matchRepository,
  IRefereeRepository _refereeRepository,
  IOptions<GameOptions> _gameOptions) : IFixtureSchedulingService
{
  public async Task<int> ScheduleDoubleRoundRobinAsync(
    int divisionId,
    IReadOnlyList<Guid> orderedClubIds,
    int matchWeekCount,
    DateTime? utcNow = null,
    CancellationToken cancellationToken = default)
  {
    ArgumentNullException.ThrowIfNull(orderedClubIds);

    if (orderedClubIds.Count < 2)
    {
      throw new BusinessException("Fikstür için en az 2 kulüp gerekir.");
    }

    if (orderedClubIds.Count % 2 != 0)
    {
      throw new BusinessException("Çift tur fikstür için kulüp sayısı çift olmalıdır.");
    }

    if (matchWeekCount <= 0)
    {
      throw new BusinessException("Maç haftası sayısı 0'dan büyük olmalıdır.");
    }

    int expectedWeeks = (orderedClubIds.Count - 1) * 2;
    if (matchWeekCount != expectedWeeks)
    {
      throw new BusinessException(
        $"Çift tur fikstür {orderedClubIds.Count} kulüp için {expectedWeeks} maç haftası gerektirir.");
    }

    List<(Guid HomeClubId, Guid AwayClubId, int MatchWeek)> slots =
      BuildDoubleRoundRobinSlots(orderedClubIds, matchWeekCount);

    GameOptions options = _gameOptions.Value;
    DateTime firstKickoffLocal = GameLocalClock.GetNextKickoffLocal(
      utcNow ?? DateTime.UtcNow,
      options.MatchKickoffLocalTime);

    List<int> refereeIds = await LoadRefereeIdsAsync(cancellationToken);
    int refereeCursor = 0;
    int created = 0;

    foreach ((Guid homeClubId, Guid awayClubId, int matchWeek) in slots)
    {
      DateTime localKickoff = DateTime.SpecifyKind(
        firstKickoffLocal.Date.AddDays(matchWeek - 1) + options.MatchKickoffLocalTime,
        DateTimeKind.Unspecified);

      int? refereeId = null;
      if (refereeIds.Count > 0)
      {
        refereeId = refereeIds[refereeCursor % refereeIds.Count];
        refereeCursor += 1;
      }

      Match match = new()
      {
        DivisionId = divisionId,
        MatchWeek = matchWeek,
        HomeClubId = homeClubId,
        AwayClubId = awayClubId,
        RefereeId = refereeId,
        MatchDate = GameLocalClock.ConvertLocalToUtc(localKickoff),
        IsPlayed = false
      };

      await _matchRepository.AddAsync(match, cancellationToken);
      created += 1;
    }

    return created;
  }

  private async Task<List<int>> LoadRefereeIdsAsync(CancellationToken cancellationToken)
  {
    List<Referee> referees = await _refereeRepository.GetAllAsync(
      orderBy: query => query.OrderBy(r => r.Id),
      cancellationToken: cancellationToken);

    return referees.Select(r => r.Id).ToList();
  }

  /// <summary>
  /// Circle method single RR, then home/away reversed for the return leg.
  /// Match weeks are 1..matchWeekCount.
  /// </summary>
  internal static List<(Guid HomeClubId, Guid AwayClubId, int MatchWeek)> BuildDoubleRoundRobinSlots(
    IReadOnlyList<Guid> orderedClubIds,
    int matchWeekCount)
  {
    List<Guid> rotation = orderedClubIds.ToList();
    int teamCount = rotation.Count;
    int singleLegWeeks = teamCount - 1;
    List<(Guid Home, Guid Away, int Week)> firstLeg = [];

    for (int week = 1; week <= singleLegWeeks; week++)
    {
      for (int i = 0; i < teamCount / 2; i++)
      {
        Guid home = rotation[i];
        Guid away = rotation[teamCount - 1 - i];

        // Alternate polarity so the fixed first club is not always home.
        if (week % 2 == 0)
        {
          (home, away) = (away, home);
        }

        firstLeg.Add((home, away, week));
      }

      RotateRightKeepingFirstFixed(rotation);
    }

    List<(Guid HomeClubId, Guid AwayClubId, int MatchWeek)> slots = [];
    slots.AddRange(firstLeg.Select(s => (s.Home, s.Away, s.Week)));

    foreach ((Guid home, Guid away, int week) in firstLeg)
    {
      slots.Add((away, home, week + singleLegWeeks));
    }

    if (slots.Count == 0 || slots.Max(s => s.MatchWeek) != matchWeekCount)
    {
      throw new BusinessException("Fikstür hafta üretimi yapılandırma ile uyuşmuyor.");
    }

    return slots;
  }

  private static void RotateRightKeepingFirstFixed(List<Guid> teams)
  {
    if (teams.Count <= 2)
    {
      return;
    }

    Guid last = teams[^1];
    for (int i = teams.Count - 1; i >= 2; i--)
    {
      teams[i] = teams[i - 1];
    }

    teams[1] = last;
  }
}
