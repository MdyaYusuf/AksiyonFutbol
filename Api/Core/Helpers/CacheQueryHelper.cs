using System.Linq.Expressions;
using Api.Core.Entities;

namespace Api.Core.Helpers;

public static class CacheQueryHelper
{
  public static bool CanUseDefaultCache<TEntity, TId>(
    Expression<Func<TEntity, bool>>? filter,
    Func<IQueryable<TEntity>, IQueryable<TEntity>>? include,
    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy,
    bool enableTracking,
    bool withDeleted)
    where TEntity : Entity<TId>, new()
    where TId : notnull
  {
    return filter == null &&
      include == null &&
      orderBy == null &&
      !enableTracking &&
      !withDeleted;
  }
}
