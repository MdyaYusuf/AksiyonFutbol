using FluentValidation;

namespace Api.Features.ClubPresidents;

public class CreateClubPresidentRequestValidator : AbstractValidator<CreateClubPresidentRequest>
{
  public CreateClubPresidentRequestValidator()
  {
    RuleFor(cp => cp.Name)
      .NotEmpty().WithMessage("Başkan adı boş olamaz.")
      .MinimumLength(3).WithMessage("Başkan adı en az 3 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Başkan adı 100 karakterden uzun olamaz.");

    RuleFor(cp => cp.Charisma)
      .InclusiveBetween(
        ClubPresidentBusinessRules.AttributeMin,
        ClubPresidentBusinessRules.AttributeMax)
      .WithMessage(
        $"Charisma {ClubPresidentBusinessRules.AttributeMin} ile {ClubPresidentBusinessRules.AttributeMax} arasında olmalıdır.");

    RuleFor(cp => cp.Authority)
      .InclusiveBetween(
        ClubPresidentBusinessRules.AttributeMin,
        ClubPresidentBusinessRules.AttributeMax)
      .WithMessage(
        $"Authority {ClubPresidentBusinessRules.AttributeMin} ile {ClubPresidentBusinessRules.AttributeMax} arasında olmalıdır.");

    RuleFor(cp => cp.Integrity)
      .InclusiveBetween(
        ClubPresidentBusinessRules.AttributeMin,
        ClubPresidentBusinessRules.AttributeMax)
      .WithMessage(
        $"Integrity {ClubPresidentBusinessRules.AttributeMin} ile {ClubPresidentBusinessRules.AttributeMax} arasında olmalıdır.");

    RuleFor(cp => cp.Cunning)
      .InclusiveBetween(
        ClubPresidentBusinessRules.AttributeMin,
        ClubPresidentBusinessRules.AttributeMax)
      .WithMessage(
        $"Cunning {ClubPresidentBusinessRules.AttributeMin} ile {ClubPresidentBusinessRules.AttributeMax} arasında olmalıdır.");

    RuleFor(cp => cp.Connections)
      .InclusiveBetween(
        ClubPresidentBusinessRules.AttributeMin,
        ClubPresidentBusinessRules.AttributeMax)
      .WithMessage(
        $"Connections {ClubPresidentBusinessRules.AttributeMin} ile {ClubPresidentBusinessRules.AttributeMax} arasında olmalıdır.");

    RuleFor(cp => cp)
      .Must(request =>
        ClubPresidentBusinessRules.CalculateSpentAttributePoints(
          request.Charisma,
          request.Authority,
          request.Integrity,
          request.Cunning,
          request.Connections) == ClubPresidentBusinessRules.AttributePointBudget)
      .WithMessage(
        $"Başkan özellikleri için tam {ClubPresidentBusinessRules.AttributePointBudget} puan dağıtılmalıdır.");
  }
}

public class UpdateClubPresidentRequestValidator : AbstractValidator<UpdateClubPresidentRequest>
{
  public UpdateClubPresidentRequestValidator()
  {
    RuleFor(cp => cp.Id)
      .NotEmpty().WithMessage("Geçersiz başkan ID.");

    RuleFor(cp => cp.Name)
      .NotEmpty().WithMessage("Başkan adı boş olamaz.")
      .MinimumLength(3).WithMessage("Başkan adı en az 3 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Başkan adı 100 karakterden uzun olamaz.");
  }
}

public class UpdateClubPresidentReputationRequestValidator : AbstractValidator<UpdateClubPresidentReputationRequest>
{
  public UpdateClubPresidentReputationRequestValidator()
  {
    RuleFor(cp => cp.Id)
      .NotEmpty().WithMessage("Geçersiz başkan ID.");

    RuleFor(cp => cp.ReputationPoints)
      .GreaterThanOrEqualTo(0).WithMessage("Meşruiyet puanı negatif olamaz.");
  }
}
