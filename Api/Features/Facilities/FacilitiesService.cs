using Api.Core.Exceptions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Clubs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Facilities;

public class FacilitiesService(
  IClubFacilityRepository _clubFacilityRepository,
  IClubRepository _clubRepository,
  FacilitiesBusinessRules _businessRules,
  FacilitiesMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<UpgradeFacilityRequest> _upgradeValidator) : IFacilitiesService
{
  public async Task<ReturnModel<ClubFacilitiesOverviewDto>> GetForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    await _businessRules.EnsureDefaultFacilitiesAsync(club.Id, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    ClubFacilitiesOverviewDto overview = await BuildOverviewAsync(club.Id, cancellationToken);

    return new ReturnModel<ClubFacilitiesOverviewDto>()
    {
      Success = true,
      Message = "Kulüp tesisleri başarılı bir şekilde getirildi.",
      Data = overview,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClubFacilitiesOverviewDto>> UpgradeForCurrentUserAsync(
    UpgradeFacilityRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _upgradeValidator.ValidateAndThrowAsync(request, cancellationToken);

    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: query => query.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.EnsureDefaultFacilitiesAsync(club.Id, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    ClubFacility facility = await _businessRules.GetFacilityForClubAsync(
      club.Id,
      request.FacilityType,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.FacilityMustNotBeMaxLevel(facility);

    decimal cost = _businessRules.CalculateUpgradeCost(facility.Level);
    _businessRules.ClubMustAffordUpgrade(club, cost);

    club.Cash -= cost;
    facility.Level += 1;
    facility.UpdatedDate = DateTime.UtcNow;
    ApplyUpgradeEffects(club, facility.FacilityType);

    _clubRepository.Update(club);
    _clubFacilityRepository.Update(facility);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    ClubFacilitiesOverviewDto overview = await BuildOverviewAsync(club.Id, cancellationToken);

    return new ReturnModel<ClubFacilitiesOverviewDto>()
    {
      Success = true,
      Message = $"{_businessRules.GetFacilityTypeName(facility.FacilityType)} seviye {facility.Level} oldu.",
      Data = overview,
      StatusCode = 200
    };
  }

  private void ApplyUpgradeEffects(Club club, FacilityType facilityType)
  {
    var options = _businessRules.Options;

    if (facilityType == FacilityType.TrainingGround)
    {
      club.Morale = ClampStatus(club.Morale + options.FacilityTrainingMoraleBonus);
      club.Chemistry = ClampStatus(club.Chemistry + options.FacilityTrainingChemistryBonus);
      return;
    }

    if (facilityType == FacilityType.YouthAcademy)
    {
      club.Discipline = ClampStatus(club.Discipline + options.FacilityAcademyDisciplineBonus);
    }
  }

  private static int ClampStatus(int value)
  {
    if (value < 0)
    {
      return 0;
    }

    if (value > 100)
    {
      return 100;
    }

    return value;
  }

  private async Task<ClubFacilitiesOverviewDto> BuildOverviewAsync(
    Guid clubId,
    CancellationToken cancellationToken)
  {
    Club club = await _clubRepository.GetByIdAsync(clubId, cancellationToken: cancellationToken)
      ?? throw new NotFoundException("Kulüp bulunamadı.");

    List<ClubFacility> facilities = await _clubFacilityRepository.GetAllAsync(
      filter: f => f.ClubId == clubId,
      orderBy: query => query.OrderBy(f => f.FacilityType),
      cancellationToken: cancellationToken);

    int maxLevel = _businessRules.Options.FacilityMaxLevel;
    List<ClubFacilityResponseDto> facilityDtos = facilities
      .Select(facility =>
      {
        decimal nextCost = _businessRules.CalculateUpgradeCost(facility.Level);
        bool canAfford = club.Cash >= nextCost;

        return _mapper.ToFacilityDto(
          facility,
          maxLevel,
          nextCost,
          canAfford,
          _businessRules.GetFacilityTypeName(facility.FacilityType));
      })
      .ToList();

    return _mapper.ToOverviewDto(club, facilityDtos);
  }
}
