using Api.Core.Repositories;

namespace Api.Features.Objectives;

public interface IClubObjectiveProgressRepository : IRepository<ClubObjectiveProgress, Guid>
{
}

public interface IPresidentTitleUnlockRepository : IRepository<PresidentTitleUnlock, Guid>
{
}
