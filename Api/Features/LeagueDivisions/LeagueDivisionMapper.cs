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
  public partial List<LeagueDivisionResponseDto> EntityToResponseDtoList(List<LeagueDivision> entities);
  public partial List<LeagueDivisionPreviewDto> EntityToPreviewDtoList(List<LeagueDivision> entities);
}
