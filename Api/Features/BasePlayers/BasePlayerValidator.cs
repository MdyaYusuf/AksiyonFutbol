using FluentValidation;

namespace Api.Features.BasePlayers;

public static class PlayerAttributesDtoValidator
{
  public static void AddRules<T>(
    AbstractValidator<T> validator,
    Func<T, PlayerPosition> positionSelector,
    Func<T, PlayerAttributesDto?> attributesSelector)
  {
    validator.RuleFor(request => attributesSelector(request))
      .NotNull()
      .WithMessage("Oyuncu özellikleri zorunludur.");

    validator.When(
      request => attributesSelector(request) != null,
      () =>
      {
        validator.RuleFor(request => attributesSelector(request)!.Physical)
          .NotNull()
          .WithMessage("Fiziksel özellikler zorunludur.");

        validator.RuleFor(request => attributesSelector(request)!.Mental)
          .NotNull()
          .WithMessage("Zihinsel özellikler zorunludur.");
      });

    validator.When(
      request => attributesSelector(request)?.Physical != null,
      () =>
      {
        AddRange(validator, request => attributesSelector(request)!.Physical!.Pace, "Hız");
        AddRange(validator, request => attributesSelector(request)!.Physical!.Stamina, "Dayanıklılık");
        AddRange(validator, request => attributesSelector(request)!.Physical!.Strength, "Güç");
        AddRange(validator, request => attributesSelector(request)!.Physical!.Balance, "Denge");
        AddRange(validator, request => attributesSelector(request)!.Physical!.Jumping, "Sıçrama");
      });

    validator.When(
      request => attributesSelector(request)?.Mental != null,
      () =>
      {
        AddRange(validator, request => attributesSelector(request)!.Mental!.Decisions, "Karar verme");
        AddRange(validator, request => attributesSelector(request)!.Mental!.Positioning, "Pozisyon alma");
        AddRange(validator, request => attributesSelector(request)!.Mental!.Teamwork, "Takım oyunu");
        AddRange(validator, request => attributesSelector(request)!.Mental!.WorkRate, "Çalışkanlık");
        AddRange(validator, request => attributesSelector(request)!.Mental!.Leadership, "Liderlik");
      });

    validator.When(
      request =>
        attributesSelector(request) != null &&
        positionSelector(request) == PlayerPosition.Goalkeeper,
      () =>
      {
        validator.RuleFor(request => attributesSelector(request)!.Goalkeeping)
          .NotNull()
          .WithMessage("Kaleci için kalecilik özellikleri zorunludur.");

        validator.RuleFor(request => attributesSelector(request)!.Attack)
          .Null()
          .WithMessage("Kaleci için hücum özellikleri gönderilemez.");

        validator.RuleFor(request => attributesSelector(request)!.Midfield)
          .Null()
          .WithMessage("Kaleci için orta saha özellikleri gönderilemez.");

        validator.RuleFor(request => attributesSelector(request)!.Defense)
          .Null()
          .WithMessage("Kaleci için savunma özellikleri gönderilemez.");
      });

    validator.When(
      request =>
        attributesSelector(request)?.Goalkeeping != null &&
        positionSelector(request) == PlayerPosition.Goalkeeper,
      () =>
      {
        AddRange(validator, request => attributesSelector(request)!.Goalkeeping!.Reflexes, "Refleksler");
        AddRange(validator, request => attributesSelector(request)!.Goalkeeping!.OneOnOnes, "Bire bir");
        AddRange(validator, request => attributesSelector(request)!.Goalkeeping!.Handling, "Top tutma");
        AddRange(validator, request => attributesSelector(request)!.Goalkeeping!.RushingOut, "Çıkış");
        AddRange(validator, request => attributesSelector(request)!.Goalkeeping!.Distribution, "Dağıtım");
      });

    validator.When(
      request =>
        attributesSelector(request) != null &&
        positionSelector(request) != PlayerPosition.Goalkeeper,
      () =>
      {
        validator.RuleFor(request => attributesSelector(request)!.Attack)
          .NotNull()
          .WithMessage("Saha oyuncusu için hücum özellikleri zorunludur.");

        validator.RuleFor(request => attributesSelector(request)!.Midfield)
          .NotNull()
          .WithMessage("Saha oyuncusu için orta saha özellikleri zorunludur.");

        validator.RuleFor(request => attributesSelector(request)!.Defense)
          .NotNull()
          .WithMessage("Saha oyuncusu için savunma özellikleri zorunludur.");

        validator.RuleFor(request => attributesSelector(request)!.Goalkeeping)
          .Null()
          .WithMessage("Saha oyuncusu için kalecilik özellikleri gönderilemez.");
      });

    validator.When(
      request =>
        attributesSelector(request)?.Attack != null &&
        positionSelector(request) != PlayerPosition.Goalkeeper,
      () =>
      {
        AddRange(validator, request => attributesSelector(request)!.Attack!.Finishing, "Bitiricilik");
        AddRange(validator, request => attributesSelector(request)!.Attack!.OffTheBall, "Topsuz koşu");
        AddRange(validator, request => attributesSelector(request)!.Attack!.Crossing, "Orta");
        AddRange(validator, request => attributesSelector(request)!.Attack!.LongShots, "Uzaktan şut");
        AddRange(validator, request => attributesSelector(request)!.Attack!.Composure, "Soğukkanlılık");
      });

    validator.When(
      request =>
        attributesSelector(request)?.Midfield != null &&
        positionSelector(request) != PlayerPosition.Goalkeeper,
      () =>
      {
        AddRange(validator, request => attributesSelector(request)!.Midfield!.Passing, "Pas");
        AddRange(validator, request => attributesSelector(request)!.Midfield!.Technique, "Teknik");
        AddRange(validator, request => attributesSelector(request)!.Midfield!.FirstTouch, "İlk dokunuş");
        AddRange(validator, request => attributesSelector(request)!.Midfield!.Dribbling, "Dribling");
        AddRange(validator, request => attributesSelector(request)!.Midfield!.Vision, "Görüş");
      });

    validator.When(
      request =>
        attributesSelector(request)?.Defense != null &&
        positionSelector(request) != PlayerPosition.Goalkeeper,
      () =>
      {
        AddRange(validator, request => attributesSelector(request)!.Defense!.Tackling, "Müdahale");
        AddRange(validator, request => attributesSelector(request)!.Defense!.Marking, "Markaj");
        AddRange(validator, request => attributesSelector(request)!.Defense!.Heading, "Kafa");
        AddRange(validator, request => attributesSelector(request)!.Defense!.Bravery, "Cesaret");
        AddRange(validator, request => attributesSelector(request)!.Defense!.Concentration, "Konsantrasyon");
      });
  }

  private static void AddRange<T>(
    AbstractValidator<T> validator,
    System.Linq.Expressions.Expression<Func<T, int>> selector,
    string label)
  {
    validator.RuleFor(selector)
      .InclusiveBetween(1, 100)
      .WithMessage($"{label} 1 ile 100 arasında olmalıdır.");
  }
}

public class CreateBasePlayerRequestValidator : AbstractValidator<CreateBasePlayerRequest>
{
  public CreateBasePlayerRequestValidator()
  {
    RuleFor(bp => bp.DefaultFirstName)
      .NotEmpty().WithMessage("Oyuncu adı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu adı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu adı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.DefaultLastName)
      .NotEmpty().WithMessage("Oyuncu soyadı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu soyadı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu soyadı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Nationality)
      .MaximumLength(50).WithMessage("Uyruk 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Position)
      .IsInEnum().WithMessage("Geçersiz oyuncu pozisyonu.");

    RuleFor(bp => bp.Age)
      .InclusiveBetween(16, 40).WithMessage("Oyuncu yaşı 16 ile 40 arasında olmalıdır.");

    RuleFor(bp => bp.HeightCm)
      .InclusiveBetween(150, 220).WithMessage("Oyuncu boyu 150 cm ile 220 cm arasında olmalıdır.");

    RuleFor(bp => bp.WeightKg)
      .InclusiveBetween(50, 120).WithMessage("Oyuncu kilosu 50 kg ile 120 kg arasında olmalıdır.");

    RuleFor(bp => bp.PreferredFoot)
      .IsInEnum().WithMessage("Geçersiz tercih edilen ayak değeri.");

    PlayerAttributesDtoValidator.AddRules(
      this,
      bp => bp.Position,
      bp => bp.Attributes);
  }
}

public class UpdateBasePlayerRequestValidator : AbstractValidator<UpdateBasePlayerRequest>
{
  public UpdateBasePlayerRequestValidator()
  {
    RuleFor(bp => bp.Id)
      .NotEmpty().WithMessage("Geçersiz oyuncu şablonu ID.");

    RuleFor(bp => bp.DefaultFirstName)
      .NotEmpty().WithMessage("Oyuncu adı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu adı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu adı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.DefaultLastName)
      .NotEmpty().WithMessage("Oyuncu soyadı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu soyadı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu soyadı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Nationality)
      .MaximumLength(50).WithMessage("Uyruk 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Position)
      .IsInEnum().WithMessage("Geçersiz oyuncu pozisyonu.");

    RuleFor(bp => bp.Age)
      .InclusiveBetween(16, 40).WithMessage("Oyuncu yaşı 16 ile 40 arasında olmalıdır.");

    RuleFor(bp => bp.HeightCm)
      .InclusiveBetween(150, 220).WithMessage("Oyuncu boyu 150 cm ile 220 cm arasında olmalıdır.");

    RuleFor(bp => bp.WeightKg)
      .InclusiveBetween(50, 120).WithMessage("Oyuncu kilosu 50 kg ile 120 kg arasında olmalıdır.");

    RuleFor(bp => bp.PreferredFoot)
      .IsInEnum().WithMessage("Geçersiz tercih edilen ayak değeri.");

    PlayerAttributesDtoValidator.AddRules(
      this,
      bp => bp.Position,
      bp => bp.Attributes);
  }
}
