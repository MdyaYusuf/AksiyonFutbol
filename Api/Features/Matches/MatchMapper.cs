using Riok.Mapperly.Abstractions;

namespace Api.Features.Matches;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class MatchMapper
{
  public partial Match CreateToEntity(CreateMatchRequest request);
  public partial void UpdateEntityFromScheduleRequest(UpdateMatchScheduleRequest request, Match entity);
  public partial CreatedMatchResponseDto EntityToCreatedResponseDto(Match entity);

  [MapProperty("Division.Name", nameof(MatchResponseDto.DivisionName))]
  [MapProperty("HomeClub.DisplayName", nameof(MatchResponseDto.HomeClubName))]
  [MapProperty("AwayClub.DisplayName", nameof(MatchResponseDto.AwayClubName))]
  [MapProperty("Referee.Name", nameof(MatchResponseDto.RefereeName))]
  public partial MatchResponseDto EntityToResponseDto(Match entity);

  [MapProperty("HomeClub.DisplayName", nameof(MatchPreviewDto.HomeClubName))]
  [MapProperty("AwayClub.DisplayName", nameof(MatchPreviewDto.AwayClubName))]
  public partial MatchPreviewDto EntityToPreviewDto(Match entity);

  public List<MatchResponseDto> EntityToResponseDtoList(List<Match> entities)
  {
    List<MatchResponseDto> mapped = new(entities.Count);
    foreach (Match entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }

  public List<MatchPreviewDto> EntityToPreviewDtoList(List<Match> entities)
  {
    List<MatchPreviewDto> mapped = new(entities.Count);
    foreach (Match entity in entities)
    {
      mapped.Add(EntityToPreviewDto(entity));
    }

    return mapped;
  }
}
