using Api.Core.Options;
using Api.Features.LeagueDivisions;

namespace Api.Features.ClubDrafts;

public static class BotDraftProfileResolver
{
  public static BotDraftProfileKind FromLeagueTier(LeagueTier tier)
  {
    if (tier == LeagueTier.Gold)
    {
      return BotDraftProfileKind.Gold;
    }

    if (tier == LeagueTier.Silver)
    {
      return BotDraftProfileKind.Silver;
    }

    if (tier == LeagueTier.Bronze)
    {
      return BotDraftProfileKind.Bronze;
    }

    return BotDraftProfileKind.Iron;
  }

  public static BotDraftProfileSettings GetSettings(
    BotDraftProfileKind profile,
    BotDraftOptions botDraft)
  {
    if (profile == BotDraftProfileKind.TutorialWeak)
    {
      return botDraft.TutorialWeak;
    }

    if (profile == BotDraftProfileKind.TutorialMid)
    {
      return botDraft.TutorialMid;
    }

    if (profile == BotDraftProfileKind.TutorialStrong)
    {
      return botDraft.TutorialStrong;
    }

    if (profile == BotDraftProfileKind.Iron)
    {
      return botDraft.Iron;
    }

    if (profile == BotDraftProfileKind.Bronze)
    {
      return botDraft.Bronze;
    }

    if (profile == BotDraftProfileKind.Silver)
    {
      return botDraft.Silver;
    }

    return botDraft.Gold;
  }

  public static List<BotDraftProfileKind> CreateShuffledTutorialProfiles()
  {
    List<BotDraftProfileKind> profiles =
    [
      BotDraftProfileKind.TutorialWeak,
      BotDraftProfileKind.TutorialMid,
      BotDraftProfileKind.TutorialStrong
    ];

    for (int i = profiles.Count - 1; i > 0; i--)
    {
      int swapIndex = Random.Shared.Next(i + 1);
      (profiles[i], profiles[swapIndex]) = (profiles[swapIndex], profiles[i]);
    }

    return profiles;
  }
}
