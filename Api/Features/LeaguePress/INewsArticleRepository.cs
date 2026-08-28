using Api.Core.Repositories;

namespace Api.Features.LeaguePress;

public interface INewsArticleRepository : IRepository<NewsArticle, Guid>
{
}
