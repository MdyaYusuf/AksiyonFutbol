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
}
