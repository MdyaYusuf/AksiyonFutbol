using Api.Features.BasePlayers;
using Riok.Mapperly.Abstractions;

namespace Api.Features.PlayerInstances;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class PlayerInstanceMapper
{
  public partial void UpdateEntityFromNameRequest(UpdatePlayerInstanceNameRequest request, PlayerInstance entity);
  public partial void UpdateEntityFromHealthRequest(UpdatePlayerInstanceHealthRequest request, PlayerInstance entity);
  public partial void UpdateEntityFromSeasonStatsRequest(UpdatePlayerInstanceSeasonStatsRequest request, PlayerInstance entity);

  public PlayerInstance CreateCustomToEntity(CreateCustomPlayerInstanceRequest request)
  {
    PlayerInstance entity = new()
    {
      ClubId = request.ClubId,
      FirstName = request.FirstName,
      LastName = request.LastName,
      Nationality = request.Nationality,
      Position = request.Position,
      Age = request.Age,
      HeightCm = request.HeightCm,
      WeightKg = request.WeightKg,
      PreferredFoot = request.PreferredFoot,
      MarketValue = request.MarketValue,
      Wage = request.Wage,
      IsInjured = false,
      InjuryDays = 0
    };

    PlayerAttributeMapper.ApplyToEntity(request.Attributes, entity);
    PlayerAttributeCalculator.ApplyMainStats(entity);

    return entity;
  }

  public void UpdateEntityFromStatsRequest(UpdatePlayerInstanceStatsRequest request, PlayerInstance entity)
  {
    entity.Position = request.Position;
    entity.Age = request.Age;
    entity.HeightCm = request.HeightCm;
    entity.WeightKg = request.WeightKg;
    entity.PreferredFoot = request.PreferredFoot;
    entity.MarketValue = request.MarketValue;
    entity.Wage = request.Wage;

    PlayerAttributeMapper.ApplyToEntity(request.Attributes, entity);
    PlayerAttributeCalculator.ApplyMainStats(entity);
  }

  public PlayerInstanceResponseDto EntityToResponseDto(PlayerInstance entity)
  {
    return new PlayerInstanceResponseDto
    {
      Id = entity.Id,
      FirstName = entity.FirstName,
      LastName = entity.LastName,
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
      OverallRating = PlayerInstanceRatingCalculator.Calculate(entity),
      IsInjured = entity.IsInjured,
      InjuryDays = entity.InjuryDays,
      SeasonGoals = entity.SeasonGoals,
      SeasonAssists = entity.SeasonAssists,
      SeasonYellowCards = entity.SeasonYellowCards,
      SeasonRedCards = entity.SeasonRedCards,
      MarketValue = entity.MarketValue,
      Wage = entity.Wage,
      ClubId = entity.ClubId,
      ClubName = entity.Club.Name,
      BasePlayerId = entity.BasePlayerId,
      CreatedDate = entity.CreatedDate
    };
  }

  public PlayerInstancePreviewDto EntityToPreviewDto(PlayerInstance entity)
  {
    return new PlayerInstancePreviewDto
    {
      Id = entity.Id,
      FirstName = entity.FirstName,
      LastName = entity.LastName,
      Position = entity.Position,
      Age = entity.Age,
      OverallRating = PlayerInstanceRatingCalculator.Calculate(entity),
      IsInjured = entity.IsInjured,
      InjuryDays = entity.InjuryDays,
      ClubId = entity.ClubId,
      ClubName = entity.Club.Name
    };
  }

  public CreatedPlayerInstanceResponseDto EntityToCreatedResponseDto(PlayerInstance entity)
  {
    return new CreatedPlayerInstanceResponseDto
    {
      Id = entity.Id,
      FirstName = entity.FirstName,
      LastName = entity.LastName,
      Position = entity.Position,
      ClubId = entity.ClubId
    };
  }

  public List<PlayerInstanceResponseDto> EntityToResponseDtoList(List<PlayerInstance> entities)
  {
    return entities.Select(EntityToResponseDto).ToList();
  }

  public List<PlayerInstancePreviewDto> EntityToPreviewDtoList(List<PlayerInstance> entities)
  {
    return entities.Select(EntityToPreviewDto).ToList();
  }
}
