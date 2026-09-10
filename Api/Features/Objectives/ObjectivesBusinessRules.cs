using System.Text.RegularExpressions;
using Api.Core.Exceptions;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Objectives;

public partial class ObjectivesBusinessRules(
  IClubRepository _clubRepository,
  IClubObjectiveProgressRepository _progressRepository,
  IPresidentTitleUnlockRepository _titleUnlockRepository)
{
  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      include,
      enableTracking,
      cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public void ClubMustHavePresident(Club club)
  {
    if (club.President == null || club.PresidentId == null)
    {
      throw new BusinessException("Bu kulübün başkanı yok.");
    }
  }

  public void MustBeHumanClub(Club club)
  {
    if (club.IsBot)
    {
      throw new BusinessException("Bot kulüpler için hedefler takip edilmez.");
    }
  }

  public void ProgressMustBeCompletable(ClubObjectiveProgress progress)
  {
    if (progress.Status != ObjectiveStatus.Completed)
    {
      throw new BusinessException("Bu hedef henüz tamamlanmadı veya zaten alındı.");
    }
  }

  public void TitleMustBeUnlocked(PresidentTitleUnlock? unlock, string titleKey)
  {
    if (unlock == null)
    {
      throw new BusinessException($"'{titleKey}' unvanı henüz açılmadı.");
    }
  }

  public static void ApplyProgressIncrement(ClubObjectiveProgress progress, int amount)
  {
    if (amount <= 0 || progress.Status != ObjectiveStatus.Active)
    {
      return;
    }

    progress.CurrentValue = Math.Min(progress.TargetValue, progress.CurrentValue + amount);
    progress.UpdatedDate = DateTime.UtcNow;

    if (progress.CurrentValue >= progress.TargetValue)
    {
      progress.CurrentValue = progress.TargetValue;
      progress.Status = ObjectiveStatus.Completed;
      progress.CompletedDate = DateTime.UtcNow;
    }
  }

  public static void CompleteOneShot(ClubObjectiveProgress progress)
  {
    if (progress.Status != ObjectiveStatus.Active)
    {
      return;
    }

    progress.CurrentValue = progress.TargetValue;
    progress.Status = ObjectiveStatus.Completed;
    progress.CompletedDate = DateTime.UtcNow;
    progress.UpdatedDate = DateTime.UtcNow;
  }

  public static string ToTitleKey(string displayName)
  {
    string trimmed = displayName.Trim().ToLowerInvariant();
    string collapsed = WhitespaceRegex().Replace(trimmed, "_");
    string cleaned = NonKeyCharRegex().Replace(collapsed, string.Empty);

    if (string.IsNullOrWhiteSpace(cleaned))
    {
      return "untitled";
    }

    return cleaned;
  }

  public async Task EnsureProgressSeededAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    List<ClubObjectiveProgress> existing = await _progressRepository.GetAllAsync(
      filter: p => p.ClubId == clubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    HashSet<ObjectiveKey> existingKeys = existing.Select(p => p.ObjectiveKey).ToHashSet();

    foreach (ObjectiveDefinition definition in ObjectiveCatalog.All())
    {
      if (existingKeys.Contains(definition.Key))
      {
        continue;
      }

      await _progressRepository.AddAsync(
        new ClubObjectiveProgress
        {
          ClubId = clubId,
          ObjectiveKey = definition.Key,
          CurrentValue = 0,
          TargetValue = definition.TargetValue,
          Status = ObjectiveStatus.Active
        },
        cancellationToken);
    }
  }

  public async Task<PresidentTitleUnlock?> FindTitleUnlockAsync(
    Guid presidentId,
    string titleKey,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    return await _titleUnlockRepository.GetAsync(
      t => t.PresidentId == presidentId && t.TitleKey == titleKey,
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);
  }

  public async Task UnlockTitleIfMissingAsync(
    ClubPresident president,
    string titleKey,
    string displayName,
    TitleUnlockSource source,
    CancellationToken cancellationToken = default)
  {
    bool exists = await _titleUnlockRepository.AnyAsync(
      t => t.PresidentId == president.Id && t.TitleKey == titleKey,
      cancellationToken);

    if (exists)
    {
      return;
    }

    await _titleUnlockRepository.AddAsync(
      new PresidentTitleUnlock
      {
        PresidentId = president.Id,
        TitleKey = titleKey,
        DisplayName = displayName.Trim(),
        Source = source,
        UnlockedDate = DateTime.UtcNow
      },
      cancellationToken);
  }

  [GeneratedRegex(@"\s+")]
  private static partial Regex WhitespaceRegex();

  [GeneratedRegex(@"[^a-z0-9_]")]
  private static partial Regex NonKeyCharRegex();
}
