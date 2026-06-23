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
  public partial List<RefereeResponseDto> EntityToResponseDtoList(List<Referee> entities);
  public partial List<RefereePreviewDto> EntityToPreviewDtoList(List<Referee> entities);
}
