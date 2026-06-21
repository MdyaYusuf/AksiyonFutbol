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
  public partial ClubResponseDto EntityToResponseDto(Club entity);
  [MapProperty("President.Name", nameof(ClubPreviewDto.PresidentName))]
  [MapProperty("Division.Name", nameof(ClubPreviewDto.DivisionName))]
  public partial ClubPreviewDto EntityToPreviewDto(Club entity);
  public partial CreatedClubResponseDto EntityToCreatedResponseDto(Club entity);
  public partial List<ClubResponseDto> EntityToResponseDtoList(List<Club> entities);
  public partial List<ClubPreviewDto> EntityToPreviewDtoList(List<Club> entities);
}
