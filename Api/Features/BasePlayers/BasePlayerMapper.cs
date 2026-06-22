using Riok.Mapperly.Abstractions;

namespace Api.Features.BasePlayers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class BasePlayerMapper
{
  public partial BasePlayer CreateToEntity(CreateBasePlayerRequest request);
  public partial void UpdateEntityFromRequest(UpdateBasePlayerRequest request, BasePlayer entity);
  public partial CreatedBasePlayerResponseDto EntityToCreatedResponseDto(BasePlayer entity);

  public BasePlayerResponseDto EntityToResponseDto(BasePlayer entity)
  {
    return new BasePlayerResponseDto
    {
      Id = entity.Id,
      DefaultFirstName = entity.DefaultFirstName,
      DefaultLastName = entity.DefaultLastName,
      Nationality = entity.Nationality,
      Position = entity.Position,
      Age = entity.Age,
      HeightCm = entity.HeightCm,
      WeightKg = entity.WeightKg,
      PreferredFoot = entity.PreferredFoot,
      AttackPower = entity.AttackPower,
      DefenseStrength = entity.DefenseStrength,
      MidfieldControl = entity.MidfieldControl,
      OverallRating = BasePlayerRatingCalculator.Calculate(entity),
      CreatedDate = entity.CreatedDate
    };
  }

  public BasePlayerPreviewDto EntityToPreviewDto(BasePlayer entity)
  {
    return new BasePlayerPreviewDto
    {
      Id = entity.Id,
      DefaultFirstName = entity.DefaultFirstName,
      DefaultLastName = entity.DefaultLastName,
      Position = entity.Position,
      Age = entity.Age,
      HeightCm = entity.HeightCm,
      WeightKg = entity.WeightKg,
      PreferredFoot = entity.PreferredFoot,
      OverallRating = BasePlayerRatingCalculator.Calculate(entity)
    };
  }

  public List<BasePlayerResponseDto> EntityToResponseDtoList(List<BasePlayer> entities)
  {
    return entities.Select(EntityToResponseDto).ToList();
  }

  public List<BasePlayerPreviewDto> EntityToPreviewDtoList(List<BasePlayer> entities)
  {
    return entities.Select(EntityToPreviewDto).ToList();
  }
}
