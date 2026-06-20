using Riok.Mapperly.Abstractions;

namespace Api.Features.ClubPresidents;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class ClubPresidentMapper
{
  public partial ClubPresident CreateToEntity(CreateClubPresidentRequest request);
  public partial void UpdateEntityFromRequest(UpdateClubPresidentRequest request, ClubPresident entity);
  [MapProperty("User.Username", nameof(ClubPresidentResponseDto.UserName))]
  public partial ClubPresidentResponseDto EntityToResponseDto(ClubPresident entity);
  public partial ClubPresidentPreviewDto EntityToPreviewDto(ClubPresident entity);
  public partial CreatedClubPresidentResponseDto EntityToCreatedResponseDto(ClubPresident entity);
  public partial List<ClubPresidentResponseDto> EntityToResponseDtoList(List<ClubPresident> entities);
}
