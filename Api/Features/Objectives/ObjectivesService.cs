using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Objectives;

public class ObjectivesService(
  ObjectivesBusinessRules _businessRules,
  IClubObjectiveProgressRepository _progressRepository,
  IPresidentTitleUnlockRepository _titleUnlockRepository,
  IClubRepository _clubRepository,
  IObjectivesProgressSettler _progressSettler,
  IPresidentMoralitySettler _moralitySettler,
  ObjectivesMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<ClaimObjectiveRequest> _claimValidator,
  IValidator<EquipTitleRequest> _equipValidator) : IObjectivesService
{
  public async Task<ReturnModel<ObjectivesContextDto>> GetContextForCurrentUserAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await LoadClubAsync(currentUserId, enableTracking: true, cancellationToken);
    _businessRules.MustBeHumanClub(club);
    _businessRules.ClubMustHavePresident(club);

    await PrepareClubAsync(club, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    ObjectivesContextDto context = await BuildContextAsync(club, cancellationToken);

    return new ReturnModel<ObjectivesContextDto>
    {
      Success = true,
      Message = "Hedefler başarılı bir şekilde getirildi.",
      Data = context,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ClaimObjectiveResultDto>> ClaimForCurrentUserAsync(
    ClaimObjectiveRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _claimValidator.ValidateAndThrowAsync(request, cancellationToken);

    Club club = await LoadClubAsync(currentUserId, enableTracking: true, cancellationToken);
    _businessRules.MustBeHumanClub(club);
    _businessRules.ClubMustHavePresident(club);
    ClubPresident president = club.President!;

    await PrepareClubAsync(club, cancellationToken);

    ClubObjectiveProgress? progress = await _progressRepository.GetAsync(
      p => p.ClubId == club.Id && p.ObjectiveKey == request.ObjectiveKey,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (progress == null)
    {
      throw new Api.Core.Exceptions.NotFoundException("Hedef bulunamadı.");
    }

    _businessRules.ProgressMustBeCompletable(progress);

    ObjectiveDefinition definition = ObjectiveCatalog.Get(request.ObjectiveKey);

    if (definition.CashReward > 0m)
    {
      club.Cash += definition.CashReward;
    }

    if (definition.LegitimacyReward > 0)
    {
      _moralitySettler.ApplyLegitimacyGain(president, definition.LegitimacyReward);
    }

    if (definition.InfamyReward > 0)
    {
      _moralitySettler.ApplyInfamyGain(president, definition.InfamyReward);
    }

    if (!string.IsNullOrWhiteSpace(definition.TitleKey) &&
        !string.IsNullOrWhiteSpace(definition.TitleDisplayName))
    {
      await _businessRules.UnlockTitleIfMissingAsync(
        president,
        definition.TitleKey,
        definition.TitleDisplayName,
        TitleUnlockSource.Objective,
        cancellationToken);

      president.Title = definition.TitleDisplayName;
    }

    progress.Status = ObjectiveStatus.Claimed;
    progress.ClaimedDate = DateTime.UtcNow;
    progress.UpdatedDate = DateTime.UtcNow;

    _clubRepository.Update(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    ObjectivesContextDto context = await BuildContextAsync(club, cancellationToken);
    ObjectiveProgressDto objectiveDto = context.Objectives.First(o => o.Key == definition.Key);

    return new ReturnModel<ClaimObjectiveResultDto>
    {
      Success = true,
      Message = "Hedef ödülü alındı.",
      Data = new ClaimObjectiveResultDto(
        Objective: objectiveDto,
        NewCash: club.Cash,
        NewLegitimacy: president.ReputationPoints,
        NewInfamy: president.InfamyPoints,
        EquippedTitle: president.Title?.Trim() ?? ClubPresidentBusinessRules.DefaultTitle,
        Titles: context.Titles),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<ObjectivesContextDto>> EquipTitleForCurrentUserAsync(
    EquipTitleRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _equipValidator.ValidateAndThrowAsync(request, cancellationToken);

    Club club = await LoadClubAsync(currentUserId, enableTracking: true, cancellationToken);
    _businessRules.MustBeHumanClub(club);
    _businessRules.ClubMustHavePresident(club);
    ClubPresident president = club.President!;

    string titleKey = request.TitleKey.Trim().ToLowerInvariant();
    PresidentTitleUnlock? unlock = await _businessRules.FindTitleUnlockAsync(
      president.Id,
      titleKey,
      enableTracking: false,
      cancellationToken: cancellationToken);

    _businessRules.TitleMustBeUnlocked(unlock, titleKey);

    president.Title = unlock!.DisplayName;
    _clubRepository.Update(club);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    ObjectivesContextDto context = await BuildContextAsync(club, cancellationToken);

    return new ReturnModel<ObjectivesContextDto>
    {
      Success = true,
      Message = "Unvan donatıldı.",
      Data = context,
      StatusCode = 200
    };
  }

  private async Task<Club> LoadClubAsync(
    Guid currentUserId,
    bool enableTracking,
    CancellationToken cancellationToken)
  {
    return await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: query => query.Include(c => c.President),
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);
  }

  private async Task PrepareClubAsync(Club club, CancellationToken cancellationToken)
  {
    ClubPresident president = club.President!;
    await _progressSettler.SyncIdentityThresholdsAsync(club, president, cancellationToken);
  }

  private async Task<ObjectivesContextDto> BuildContextAsync(
    Club club,
    CancellationToken cancellationToken)
  {
    ClubPresident president = club.President!;

    List<ClubObjectiveProgress> progresses = await _progressRepository.GetAllAsync(
      filter: p => p.ClubId == club.Id,
      cancellationToken: cancellationToken);

    Dictionary<ObjectiveKey, ClubObjectiveProgress> byKey = progresses
      .ToDictionary(p => p.ObjectiveKey);

    List<ObjectiveProgressDto> objectives = [];

    foreach (ObjectiveDefinition definition in ObjectiveCatalog.All())
    {
      if (!byKey.TryGetValue(definition.Key, out ClubObjectiveProgress? progress))
      {
        continue;
      }

      objectives.Add(_mapper.ToProgressDto(definition, progress));
    }

    List<PresidentTitleUnlock> unlocks = await _titleUnlockRepository.GetAllAsync(
      filter: t => t.PresidentId == president.Id,
      orderBy: query => query.OrderBy(t => t.UnlockedDate),
      cancellationToken: cancellationToken);

    string equipped = president.Title?.Trim() ?? ClubPresidentBusinessRules.DefaultTitle;
    List<PresidentTitleDto> titles = unlocks
      .Select(u => _mapper.ToTitleDto(u, equipped))
      .ToList();

    return new ObjectivesContextDto(
      ClubId: club.Id,
      EquippedTitle: equipped,
      ClaimableCount: objectives.Count(o => o.Status == ObjectiveStatus.Completed),
      Objectives: objectives,
      Titles: titles);
  }
}
