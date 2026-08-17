using Api.Features.Authentication;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Users;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class UserMapper
{
  [MapperIgnoreSource(nameof(RegisterUserRequest.Password))]
  [MapperIgnoreSource(nameof(RegisterUserRequest.ConfirmPassword))]
  [MapperIgnoreTarget(nameof(User.PasswordHash))]
  [MapperIgnoreTarget(nameof(User.PasswordKey))]
  public partial User CreateToEntity(RegisterUserRequest request);
  [MapperIgnoreTarget(nameof(User.ProfileImageUrl))]
  public partial void UpdateEntityFromRequest(UpdateUserRequest request, User entity);
  [MapProperty("Role.Name", nameof(UserResponseDto.RoleName))]
  public partial UserResponseDto EntityToResponseDto(User entity);
  public partial CreatedUserResponseDto EntityToCreatedResponseDto(User entity);

  public List<UserResponseDto> EntityToResponseDtoList(List<User> entities)
  {
    List<UserResponseDto> mapped = new(entities.Count);
    foreach (User entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }

  [MapProperty("Role.Name", "RoleName")]
  public partial UserPreviewDto EntityToPreviewDto(User entity);

  public List<UserPreviewDto> EntityToPreviewDtoList(List<User> entities)
  {
    List<UserPreviewDto> mapped = new(entities.Count);
    foreach (User entity in entities)
    {
      mapped.Add(EntityToPreviewDto(entity));
    }

    return mapped;
  }
}