using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.ClubDrafts;

public interface IClubDraftPickRepository : IRepository<ClubDraftPick, Guid>
{
}

public class EfClubDraftPickRepository : EfBaseRepository<BaseDbContext, ClubDraftPick, Guid>, IClubDraftPickRepository
{
  public EfClubDraftPickRepository(BaseDbContext context) : base(context)
  {
  }
}
