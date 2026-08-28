namespace Api.Features.ClubPresidents;

public interface IPresidentMoralitySettler
{
  int ApplyLegitimacyGain(ClubPresident president, int amount);

  int ApplyLegitimacyLoss(ClubPresident president, int amount);

  int ApplyInfamyGain(ClubPresident president, int amount);
}

public class PresidentMoralitySettler : IPresidentMoralitySettler
{
  public int ApplyLegitimacyGain(ClubPresident president, int amount)
  {
    if (amount <= 0)
    {
      return 0;
    }

    int before = president.ReputationPoints;
    president.ReputationPoints = ClubPresidentMoralityBusinessRules.CalculateLegitimacyAfterGain(
      before,
      amount);

    return ClubPresidentMoralityBusinessRules.AppliedLegitimacyGain(
      before,
      president.ReputationPoints);
  }

  public int ApplyLegitimacyLoss(ClubPresident president, int amount)
  {
    if (amount <= 0)
    {
      return 0;
    }

    int before = president.ReputationPoints;
    president.ReputationPoints = ClubPresidentMoralityBusinessRules.CalculateLegitimacyAfterLoss(
      before,
      amount);

    return ClubPresidentMoralityBusinessRules.AppliedLegitimacyLoss(
      before,
      president.ReputationPoints);
  }

  public int ApplyInfamyGain(ClubPresident president, int amount)
  {
    if (amount <= 0)
    {
      return 0;
    }

    int before = president.InfamyPoints;
    president.InfamyPoints = ClubPresidentMoralityBusinessRules.CalculateInfamyAfterGain(
      before,
      amount);

    return ClubPresidentMoralityBusinessRules.AppliedInfamyGain(
      before,
      president.InfamyPoints);
  }
}
