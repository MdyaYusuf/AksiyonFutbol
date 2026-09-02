using Api.Core.Responses;
using Api.Features.Clubs;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.LeaguePress;

public interface ILeaguePressService
{
  Task<ReturnModel<List<NewsArticleDto>>> GetMyFeedAsync(
    Guid currentUserId,
    NewsArticleKind? kind = null,
    int? limit = null,
    CancellationToken cancellationToken = default);
}

public class LeaguePressService(
  LeaguePressBusinessRules _businessRules,
  INewsArticleRepository _newsArticleRepository,
  LeaguePressMapper _mapper) : ILeaguePressService
{
  public async Task<ReturnModel<List<NewsArticleDto>>> GetMyFeedAsync(
    Guid currentUserId,
    NewsArticleKind? kind = null,
    int? limit = null,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken);

    if (!club.DivisionId.HasValue)
    {
      return new ReturnModel<List<NewsArticleDto>>()
      {
        Success = true,
        Message = "Haber akışı henüz mevcut değil.",
        Data = [],
        StatusCode = 200
      };
    }

    int divisionId = club.DivisionId.Value;
    int take = limit.HasValue ? Math.Clamp(limit.Value, 1, 100) : 100;

    List<NewsArticle> articles = await _newsArticleRepository.GetAllAsync(
      filter: kind.HasValue
        ? kind.Value switch
        {
          NewsArticleKind.ClubLife => a =>
            a.DivisionId == divisionId &&
            (a.Kind == NewsArticleKind.ClubLife || a.Kind == NewsArticleKind.Placement),
          _ => a => a.DivisionId == divisionId && a.Kind == kind.Value
        }
        : a => a.DivisionId == divisionId,
      include: query => query.Include(a => a.SubjectClub),
      orderBy: query => query.OrderByDescending(a => a.CreatedDate),
      cancellationToken: cancellationToken);

    List<NewsArticleDto> response = articles
      .Take(take)
      .Select(_mapper.ToDto)
      .ToList();

    return new ReturnModel<List<NewsArticleDto>>()
    {
      Success = true,
      Message = "Division haber akışı başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }
}
