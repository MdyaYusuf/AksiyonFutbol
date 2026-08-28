using Api.Core.Options;
using Api.Features.ClubPresidents;

namespace Api.Features.Actions;

public static class ClubActionPresentationRules
{
  public static ClubActionPathAffinity GetPathAffinity(ClubActionDefinition definition)
  {
    if (definition.IsShady)
    {
      return ClubActionPathAffinity.Shady;
    }

    if (IsHonorablePowerAction(definition) ||
        definition.Type is ClubActionType.TeamBonding or ClubActionType.MotivationalTalk)
    {
      return ClubActionPathAffinity.Honorable;
    }

    return ClubActionPathAffinity.Neutral;
  }

  public static bool IsHonorablePowerAction(ClubActionDefinition definition)
  {
    return definition.MinLegitimacy >= ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold &&
      !definition.IsShady;
  }

  public static IReadOnlyList<ClubActionRequirementDto> BuildRequirements(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    List<ClubActionRequirementDto> requirements = [];

    AddAttributeRequirement(
      requirements,
      "charisma",
      "Charisma",
      definition.MinCharisma,
      president?.Charisma ?? 0);

    AddAttributeRequirement(
      requirements,
      "authority",
      "Authority",
      definition.MinAuthority,
      president?.Authority ?? 0);

    AddAttributeRequirement(
      requirements,
      "integrity",
      "Integrity",
      definition.MinIntegrity,
      president?.Integrity ?? 0);

    AddAttributeRequirement(
      requirements,
      "cunning",
      "Cunning",
      definition.MinCunning,
      president?.Cunning ?? 0);

    AddAttributeRequirement(
      requirements,
      "connections",
      "Connections",
      definition.MinConnections,
      president?.Connections ?? 0);

    if (definition.MinLegitimacy > 0)
    {
      int current = president?.ReputationPoints ?? 0;
      requirements.Add(new ClubActionRequirementDto
      {
        Key = "legitimacy",
        Label = "Legitimacy",
        RequiredValue = definition.MinLegitimacy,
        CurrentValue = current,
        IsMet = current >= definition.MinLegitimacy
      });
    }

    if (definition.RequiresShadyTierII)
    {
      int threshold = ClubPresidentMoralityBusinessRules.ShadyTierIIInfamyThreshold;
      int current = president?.InfamyPoints ?? 0;
      requirements.Add(new ClubActionRequirementDto
      {
        Key = "infamy",
        Label = "Infamy",
        RequiredValue = threshold,
        CurrentValue = current,
        IsMet = current >= threshold
      });
    }

    return requirements;
  }

  public static (int? LegitimacyDelta, int? InfamyDelta) GetSuccessMoralityPreview(
    ClubActionDefinition definition,
    GameOptions options)
  {
    if (definition.IsShady)
    {
      return (null, options.ShadySuccessInfamyGain);
    }

    int? legitimacy = definition.Type switch
    {
      ClubActionType.CommunityDay => options.CommunityDayLegitimacyGain,
      ClubActionType.AcademyPush => options.AcademyPushLegitimacyGain,
      ClubActionType.FairPlayPledge => options.FairPlayPledgeLegitimacyGain,
      ClubActionType.CleanMediaCampaign => options.CleanMediaCampaignLegitimacyGain,
      ClubActionType.FederationAlly => options.FederationAllyLegitimacyGain,
      ClubActionType.MediaSpin => options.MediaSpinReputationRepair,
      ClubActionType.LobbyFederation => -options.LobbyFederationReputationCost,
      ClubActionType.TeamBonding => options.HonorableSquadLegitimacyGain,
      ClubActionType.MotivationalTalk => options.HonorableSquadLegitimacyGain,
      _ => null
    };

    return (legitimacy, null);
  }

  public static string? GetUnlockHint(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    if (definition.RequiresShadyTierII &&
        !ClubPresidentMoralityBusinessRules.HasShadyTierIIUnlock(president?.InfamyPoints ?? 0))
    {
      return
        $"Reach Infamy {ClubPresidentMoralityBusinessRules.ShadyTierIIInfamyThreshold} through successful gray-area play to unlock this advanced action.";
    }

    if (IsHonorablePowerAction(definition) &&
        (president?.ReputationPoints ?? 0) < definition.MinLegitimacy)
    {
      return
        $"Reach Legitimacy {ClubPresidentMoralityBusinessRules.HonorablePowerLegitimacyThreshold} through clean wins and honorable actions to unlock this power move.";
    }

    return null;
  }

  public static bool IsUnlockTeaser(
    ClubActionDefinition definition,
    ClubPresident? president)
  {
    return GetUnlockHint(definition, president) != null;
  }

  private static void AddAttributeRequirement(
    List<ClubActionRequirementDto> requirements,
    string key,
    string label,
    int required,
    int current)
  {
    if (required <= 0)
    {
      return;
    }

    requirements.Add(new ClubActionRequirementDto
    {
      Key = key,
      Label = label,
      RequiredValue = required,
      CurrentValue = current,
      IsMet = current >= required
    });
  }
}
