using Riok.Mapperly.Abstractions;

namespace Api.Features.Clubs;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class ClubMapper
{
  public partial Club CreateToEntity(CreateClubRequest request);
  public partial Club CreateBotToEntity(CreateBotClubRequest request);
  public partial void UpdateEntityFromRequest(UpdateClubRequest request, Club entity);
  [MapProperty("President.Name", nameof(ClubResponseDto.PresidentName))]
  [MapProperty("Division.Name", nameof(ClubResponseDto.DivisionName))]
  [MapProperty("Division.Tier", nameof(ClubResponseDto.DivisionTier))]
  [MapProperty("Division.GroupNumber", nameof(ClubResponseDto.DivisionGroupNumber))]
  [MapProperty("Division.CurrentSeason", nameof(ClubResponseDto.DivisionCurrentSeason))]
  public partial ClubResponseDto EntityToResponseDto(Club entity);
  [MapProperty("President.Name", nameof(ClubPreviewDto.PresidentName))]
  [MapProperty("Division.Name", nameof(ClubPreviewDto.DivisionName))]
  public partial ClubPreviewDto EntityToPreviewDto(Club entity);
  public partial CreatedClubResponseDto EntityToCreatedResponseDto(Club entity);

  public List<ClubResponseDto> EntityToResponseDtoList(List<Club> entities)
  {
    List<ClubResponseDto> mapped = new(entities.Count);
    foreach (Club entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }

  public List<ClubPreviewDto> EntityToPreviewDtoList(List<Club> entities)
  {
    List<ClubPreviewDto> mapped = new(entities.Count);
    foreach (Club entity in entities)
    {
      mapped.Add(EntityToPreviewDto(entity));
    }

    return mapped;
  }
}
