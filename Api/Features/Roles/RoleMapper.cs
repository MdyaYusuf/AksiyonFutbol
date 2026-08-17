using Riok.Mapperly.Abstractions;

namespace Api.Features.Roles;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class RoleMapper
{
  public partial Role CreateToEntity(CreateRoleRequest request);
  public partial void UpdateEntityFromRequest(UpdateRoleRequest request, Role entity);
  public partial RoleResponseDto EntityToResponseDto(Role entity);
  public List<RoleResponseDto> EntityToResponseDtoList(List<Role> entities)
  {
    List<RoleResponseDto> mapped = new(entities.Count);
    foreach (Role entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }
}