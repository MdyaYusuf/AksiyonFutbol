using FluentValidation;

namespace Api.Features.Facilities;

public class UpgradeFacilityRequestValidator : AbstractValidator<UpgradeFacilityRequest>
{
  public UpgradeFacilityRequestValidator()
  {
    RuleFor(x => x.FacilityType)
      .IsInEnum()
      .WithMessage("Geçersiz tesis türü.");
  }
}
