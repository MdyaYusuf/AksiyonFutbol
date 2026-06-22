using FluentValidation;

namespace Api.Features.PlayerInstances;

public class CreatePlayerInstanceFromBasePlayerRequestValidator : AbstractValidator<CreatePlayerInstanceFromBasePlayerRequest>
{
  public CreatePlayerInstanceFromBasePlayerRequestValidator()
  {
    RuleFor(pi => pi.ClubId)
      .NotEmpty().WithMessage("Geçersiz kulüp ID.");

    RuleFor(pi => pi.BasePlayerId)
      .NotEmpty().WithMessage("Geçersiz oyuncu şablonu ID.");

    RuleFor(pi => pi.MarketValue)
      .GreaterThanOrEqualTo(0).WithMessage("Piyasa değeri negatif olamaz.");

    RuleFor(pi => pi.Wage)
      .GreaterThanOrEqualTo(0).WithMessage("Maaş negatif olamaz.");
  }
}

public class CreateCustomPlayerInstanceRequestValidator : AbstractValidator<CreateCustomPlayerInstanceRequest>
{
  public CreateCustomPlayerInstanceRequestValidator()
  {
    RuleFor(pi => pi.ClubId)
      .NotEmpty().WithMessage("Geçersiz kulüp ID.");

    RuleFor(pi => pi.FirstName)
      .NotEmpty().WithMessage("Oyuncu adı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu adı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu adı 50 karakterden uzun olamaz.");

    RuleFor(pi => pi.LastName)
      .NotEmpty().WithMessage("Oyuncu soyadı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu soyadı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu soyadı 50 karakterden uzun olamaz.");

    RuleFor(pi => pi.Nationality)
      .MaximumLength(50).WithMessage("Uyruk 50 karakterden uzun olamaz.");

    RuleFor(pi => pi.Position)
      .IsInEnum().WithMessage("Geçersiz oyuncu pozisyonu.");

    RuleFor(pi => pi.Age)
      .InclusiveBetween(16, 40).WithMessage("Oyuncu yaşı 16 ile 40 arasında olmalıdır.");

    RuleFor(pi => pi.HeightCm)
      .InclusiveBetween(150, 220).WithMessage("Oyuncu boyu 150 cm ile 220 cm arasında olmalıdır.");

    RuleFor(pi => pi.WeightKg)
      .InclusiveBetween(50, 120).WithMessage("Oyuncu kilosu 50 kg ile 120 kg arasında olmalıdır.");

    RuleFor(pi => pi.PreferredFoot)
      .IsInEnum().WithMessage("Geçersiz tercih edilen ayak değeri.");

    RuleFor(pi => pi.AttackPower)
      .InclusiveBetween(1, 100).WithMessage("Hücum gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(pi => pi.DefenseStrength)
      .InclusiveBetween(1, 100).WithMessage("Savunma gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(pi => pi.MidfieldControl)
      .InclusiveBetween(1, 100).WithMessage("Orta saha kontrolü 1 ile 100 arasında olmalıdır.");

    RuleFor(pi => pi.MarketValue)
      .GreaterThanOrEqualTo(0).WithMessage("Piyasa değeri negatif olamaz.");

    RuleFor(pi => pi.Wage)
      .GreaterThanOrEqualTo(0).WithMessage("Maaş negatif olamaz.");
  }
}

public class UpdatePlayerInstanceNameRequestValidator : AbstractValidator<UpdatePlayerInstanceNameRequest>
{
  public UpdatePlayerInstanceNameRequestValidator()
  {
    RuleFor(pi => pi.Id)
      .NotEmpty().WithMessage("Geçersiz oyuncu ID.");

    RuleFor(pi => pi.FirstName)
      .NotEmpty().WithMessage("Oyuncu adı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu adı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu adı 50 karakterden uzun olamaz.");

    RuleFor(pi => pi.LastName)
      .NotEmpty().WithMessage("Oyuncu soyadı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu soyadı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu soyadı 50 karakterden uzun olamaz.");
  }
}

public class UpdatePlayerInstanceStatsRequestValidator : AbstractValidator<UpdatePlayerInstanceStatsRequest>
{
  public UpdatePlayerInstanceStatsRequestValidator()
  {
    RuleFor(pi => pi.Id)
      .NotEmpty().WithMessage("Geçersiz oyuncu ID.");

    RuleFor(pi => pi.Position)
      .IsInEnum().WithMessage("Geçersiz oyuncu pozisyonu.");

    RuleFor(pi => pi.Age)
      .InclusiveBetween(16, 40).WithMessage("Oyuncu yaşı 16 ile 40 arasında olmalıdır.");

    RuleFor(pi => pi.HeightCm)
      .InclusiveBetween(150, 220).WithMessage("Oyuncu boyu 150 cm ile 220 cm arasında olmalıdır.");

    RuleFor(pi => pi.WeightKg)
      .InclusiveBetween(50, 120).WithMessage("Oyuncu kilosu 50 kg ile 120 kg arasında olmalıdır.");

    RuleFor(pi => pi.PreferredFoot)
      .IsInEnum().WithMessage("Geçersiz tercih edilen ayak değeri.");

    RuleFor(pi => pi.AttackPower)
      .InclusiveBetween(1, 100).WithMessage("Hücum gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(pi => pi.DefenseStrength)
      .InclusiveBetween(1, 100).WithMessage("Savunma gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(pi => pi.MidfieldControl)
      .InclusiveBetween(1, 100).WithMessage("Orta saha kontrolü 1 ile 100 arasında olmalıdır.");

    RuleFor(pi => pi.MarketValue)
      .GreaterThanOrEqualTo(0).WithMessage("Piyasa değeri negatif olamaz.");

    RuleFor(pi => pi.Wage)
      .GreaterThanOrEqualTo(0).WithMessage("Maaş negatif olamaz.");
  }
}

public class UpdatePlayerInstanceHealthRequestValidator : AbstractValidator<UpdatePlayerInstanceHealthRequest>
{
  public UpdatePlayerInstanceHealthRequestValidator()
  {
    RuleFor(pi => pi.Id)
      .NotEmpty().WithMessage("Geçersiz oyuncu ID.");

    RuleFor(pi => pi.InjuryDays)
      .GreaterThanOrEqualTo(0).WithMessage("Sakatlık günü negatif olamaz.");

    RuleFor(pi => pi.InjuryDays)
      .Equal(0).When(pi => !pi.IsInjured)
      .WithMessage("Sakat olmayan oyuncunun sakatlık günü 0 olmalıdır.");
  }
}

public class UpdatePlayerInstanceSeasonStatsRequestValidator : AbstractValidator<UpdatePlayerInstanceSeasonStatsRequest>
{
  public UpdatePlayerInstanceSeasonStatsRequestValidator()
  {
    RuleFor(pi => pi.Id)
      .NotEmpty().WithMessage("Geçersiz oyuncu ID.");

    RuleFor(pi => pi.SeasonGoals)
      .GreaterThanOrEqualTo(0).WithMessage("Gol sayısı negatif olamaz.");

    RuleFor(pi => pi.SeasonAssists)
      .GreaterThanOrEqualTo(0).WithMessage("Asist sayısı negatif olamaz.");

    RuleFor(pi => pi.SeasonYellowCards)
      .GreaterThanOrEqualTo(0).WithMessage("Sarı kart sayısı negatif olamaz.");

    RuleFor(pi => pi.SeasonRedCards)
      .GreaterThanOrEqualTo(0).WithMessage("Kırmızı kart sayısı negatif olamaz.");
  }
}
