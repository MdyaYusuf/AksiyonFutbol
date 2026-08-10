using FluentValidation;

namespace Api.Features.Actions;

public class ExecuteClubActionRequestValidator : AbstractValidator<ExecuteClubActionRequest>
{
  public ExecuteClubActionRequestValidator()
  {
    RuleFor(x => x.ActionType)
      .IsInEnum()
      .WithMessage("Geçerli bir aksiyon türü belirtilmelidir.");

    RuleFor(x => x.MediaSpinMode)
      .NotNull()
      .When(x => x.ActionType == ClubActionType.MediaSpin)
      .WithMessage("Medya spin modu belirtilmelidir.");

    RuleFor(x => x.MediaSpinMode)
      .IsInEnum()
      .When(x => x.MediaSpinMode.HasValue)
      .WithMessage("Geçerli bir medya spin modu belirtilmelidir.");

    RuleFor(x => x.TargetPlayerInstanceId)
      .NotNull()
      .When(x => x.ActionType == ClubActionType.TapUpTarget)
      .WithMessage("Tap-up için bir oyuncu seçilmelidir.");
  }
}
