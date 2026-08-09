namespace Api.Features.Actions;

public interface IClubActionProvider
{
  ClubActionDefinition Get(ClubActionType type);
  IReadOnlyCollection<ClubActionDefinition> All();
}
