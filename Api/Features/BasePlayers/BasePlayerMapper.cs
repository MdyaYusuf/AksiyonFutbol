using Riok.Mapperly.Abstractions;

namespace Api.Features.BasePlayers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class BasePlayerMapper
{
  public partial CreatedBasePlayerResponseDto EntityToCreatedResponseDto(BasePlayer entity);

  public BasePlayer CreateToEntity(CreateBasePlayerRequest request)
  {
    BasePlayer entity = new()
    {
      DefaultFirstName = request.DefaultFirstName,
      DefaultLastName = request.DefaultLastName,
      Nationality = request.Nationality,
      Position = request.Position,
      Age = request.Age,
      HeightCm = request.HeightCm,
      WeightKg = request.WeightKg,
      PreferredFoot = request.PreferredFoot,
      DraftTier = request.DraftTier,
      DraftFee = request.DraftFee,
      IsFreeAgentTemplate = request.IsFreeAgentTemplate,
      IsDraftOnly = request.IsDraftOnly
    };

    PlayerAttributeMapper.ApplyToEntity(request.Attributes, entity);
    PlayerAttributeCalculator.ApplyMainStats(entity);

    return entity;
  }

  public void UpdateEntityFromRequest(UpdateBasePlayerRequest request, BasePlayer entity)
  {
    entity.DefaultFirstName = request.DefaultFirstName;
    entity.DefaultLastName = request.DefaultLastName;
    entity.Nationality = request.Nationality;
    entity.Position = request.Position;
    entity.Age = request.Age;
    entity.HeightCm = request.HeightCm;
    entity.WeightKg = request.WeightKg;
    entity.PreferredFoot = request.PreferredFoot;
    entity.DraftTier = request.DraftTier;
    entity.DraftFee = request.DraftFee;
    entity.IsFreeAgentTemplate = request.IsFreeAgentTemplate;
    entity.IsDraftOnly = request.IsDraftOnly;

    PlayerAttributeMapper.ApplyToEntity(request.Attributes, entity);
    PlayerAttributeCalculator.ApplyMainStats(entity);
  }

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
      Attributes = PlayerAttributeMapper.ToDto(entity),
      AttackPower = entity.AttackPower,
      DefenseStrength = entity.DefenseStrength,
      MidfieldControl = entity.MidfieldControl,
      OverallRating = BasePlayerRatingCalculator.Calculate(entity),
      DraftTier = entity.DraftTier,
      DraftFee = entity.DraftFee,
      IsFreeAgentTemplate = entity.IsFreeAgentTemplate,
      IsDraftOnly = entity.IsDraftOnly,
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
      OverallRating = BasePlayerRatingCalculator.Calculate(entity),
      DraftTier = entity.DraftTier,
      DraftFee = entity.DraftFee,
      IsFreeAgentTemplate = entity.IsFreeAgentTemplate,
      IsDraftOnly = entity.IsDraftOnly
    };
  }

  public List<BasePlayerResponseDto> EntityToResponseDtoList(List<BasePlayer> entities)
  {
    List<BasePlayerResponseDto> mapped = new(entities.Count);
    foreach (BasePlayer entity in entities)
    {
      mapped.Add(EntityToResponseDto(entity));
    }

    return mapped;
  }

  public List<BasePlayerPreviewDto> EntityToPreviewDtoList(List<BasePlayer> entities)
  {
    List<BasePlayerPreviewDto> mapped = new(entities.Count);
    foreach (BasePlayer entity in entities)
    {
      mapped.Add(EntityToPreviewDto(entity));
    }

    return mapped;
  }
}
