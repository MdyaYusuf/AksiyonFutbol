using Api.Core.Exceptions;
using Api.Features.Clubs;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.LeaguePress;

public class LeaguePressBusinessRules(IClubRepository _clubRepository)
{
  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      include: query => query.Include(c => c.Division),
      cancellationToken: cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public static int CalculateScandalSeverityScore(int suspicion, int infamyPoints)
  {
    return Math.Clamp((suspicion + infamyPoints) / 2, 0, 100);
  }

  public static NewsArticleTone ResolveScandalTone(int severityScore)
  {
    if (severityScore >= 60)
    {
      return NewsArticleTone.Sensational;
    }

    if (severityScore >= 30)
    {
      return NewsArticleTone.Critical;
    }

    return NewsArticleTone.Neutral;
  }
}
