using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.LeaguePress;

public class EfNewsArticleRepository : EfBaseRepository<BaseDbContext, NewsArticle, Guid>, INewsArticleRepository
{
  public EfNewsArticleRepository(BaseDbContext context) : base(context)
  {
  }
}
