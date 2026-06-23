using Riok.Mapperly.Abstractions;

namespace Api.Features.Matches;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class MatchMapper
{
  public partial Match CreateToEntity(CreateMatchRequest request);
  public partial void UpdateEntityFromScheduleRequest(UpdateMatchScheduleRequest request, Match entity);
  public partial CreatedMatchResponseDto EntityToCreatedResponseDto(Match entity);

  [MapProperty("Division.Name", nameof(MatchResponseDto.DivisionName))]
  [MapProperty("HomeClub.Name", nameof(MatchResponseDto.HomeClubName))]
  [MapProperty("AwayClub.Name", nameof(MatchResponseDto.AwayClubName))]
  [MapProperty("Referee.Name", nameof(MatchResponseDto.RefereeName))]
  public partial MatchResponseDto EntityToResponseDto(Match entity);

  [MapProperty("HomeClub.Name", nameof(MatchPreviewDto.HomeClubName))]
  [MapProperty("AwayClub.Name", nameof(MatchPreviewDto.AwayClubName))]
  public partial MatchPreviewDto EntityToPreviewDto(Match entity);

  public partial List<MatchResponseDto> EntityToResponseDtoList(List<Match> entities);
  public partial List<MatchPreviewDto> EntityToPreviewDtoList(List<Match> entities);
}
