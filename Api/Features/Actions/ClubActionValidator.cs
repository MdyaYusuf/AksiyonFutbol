using FluentValidation;

namespace Api.Features.Actions;

public class ExecuteClubActionRequestValidator : AbstractValidator<ExecuteClubActionRequest>
{
  public ExecuteClubActionRequestValidator()
  {
    RuleFor(x => x.ActionType)
      .IsInEnum()
      .WithMessage("Geçerli bir aksiyon türü belirtilmelidir.");
  }
}
