using FluentValidation;

namespace Api.Features.Objectives;

public class ClaimObjectiveRequestValidator : AbstractValidator<ClaimObjectiveRequest>
{
  public ClaimObjectiveRequestValidator()
  {
    RuleFor(r => r.ObjectiveKey)
      .IsInEnum()
      .WithMessage("Geçersiz hedef anahtarı.");
  }
}

public class EquipTitleRequestValidator : AbstractValidator<EquipTitleRequest>
{
  public EquipTitleRequestValidator()
  {
    RuleFor(r => r.TitleKey)
      .NotEmpty()
      .MaximumLength(80)
      .WithMessage("Unvan anahtarı zorunludur.");
  }
}
