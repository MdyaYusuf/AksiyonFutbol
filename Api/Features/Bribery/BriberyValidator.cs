using FluentValidation;
using Api.Core.Options;
using Microsoft.Extensions.Options;

namespace Api.Features.Bribery;

public class CreateBribeAttemptRequestValidator : AbstractValidator<CreateBribeAttemptRequest>
{
  public CreateBribeAttemptRequestValidator(IOptions<GameOptions> gameOptions)
  {
    GameOptions options = gameOptions.Value;

    RuleFor(x => x.Amount)
      .GreaterThanOrEqualTo(options.BribeMinAmount)
      .WithMessage($"Yaklaşım tutarı en az {options.BribeMinAmount} olmalıdır.")
      .LessThanOrEqualTo(options.BribeMaxAmount)
      .WithMessage($"Yaklaşım tutarı en fazla {options.BribeMaxAmount} olabilir.");
  }
}
