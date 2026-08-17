using Riok.Mapperly.Abstractions;

namespace Api.Features.Referees;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class RefereeMapper
{
  public partial Referee CreateToEntity(CreateRefereeRequest request);
  public partial void UpdateEntityFromRequest(UpdateRefereeRequest request, Referee entity);
  public partial RefereeResponseDto EntityToResponseDto(Referee entity);
  public partial RefereePreviewDto EntityToPreviewDto(Referee entity);
  public partial CreatedRefereeResponseDto EntityToCreatedResponseDto(Referee entity);
  public List<RefereeResponseDto> EntityToResponseDtoList(List<Referee> entities)
  {
    List<RefereeResponseDto> mapped = new(entities.Count);
    foreach (Referee entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }

  public List<RefereePreviewDto> EntityToPreviewDtoList(List<Referee> entities)
  {
    List<RefereePreviewDto> mapped = new(entities.Count);
    foreach (Referee entity in entities)
    {
      mapped.Add(EntityToPreviewDto(entity));
    }

    return mapped;
  }
}
