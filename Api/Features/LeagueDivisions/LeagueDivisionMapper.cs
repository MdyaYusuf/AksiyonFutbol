using Riok.Mapperly.Abstractions;

namespace Api.Features.LeagueDivisions;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class LeagueDivisionMapper
{
  public partial LeagueDivision CreateToEntity(CreateLeagueDivisionRequest request);
  public partial void UpdateEntityFromRequest(UpdateLeagueDivisionRequest request, LeagueDivision entity);
  public partial LeagueDivisionResponseDto EntityToResponseDto(LeagueDivision entity);
  public partial LeagueDivisionPreviewDto EntityToPreviewDto(LeagueDivision entity);
  public partial CreatedLeagueDivisionResponseDto EntityToCreatedResponseDto(LeagueDivision entity);
  public List<LeagueDivisionResponseDto> EntityToResponseDtoList(List<LeagueDivision> entities)
  {
    List<LeagueDivisionResponseDto> mapped = new(entities.Count);
    foreach (LeagueDivision entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }

  public List<LeagueDivisionPreviewDto> EntityToPreviewDtoList(List<LeagueDivision> entities)
  {
    List<LeagueDivisionPreviewDto> mapped = new(entities.Count);
    foreach (LeagueDivision entity in entities)
    {
      mapped.Add(EntityToPreviewDto(entity));
    }

    return mapped;
  }
}
