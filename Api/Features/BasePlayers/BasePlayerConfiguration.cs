using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.BasePlayers;

public class BasePlayerConfiguration : IEntityTypeConfiguration<BasePlayer>
{
  public void Configure(EntityTypeBuilder<BasePlayer> builder)
  {
    builder.ToTable("BasePlayers");

    builder.HasKey(bp => bp.Id);

    builder.Property(bp => bp.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(bp => bp.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(bp => bp.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(bp => bp.DefaultFirstName)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(bp => bp.DefaultLastName)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(bp => bp.Nationality)
      .HasMaxLength(50)
      .IsRequired(false);

    builder.Property(bp => bp.Position)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(bp => bp.Age)
      .IsRequired();

    builder.Property(bp => bp.HeightCm)
      .IsRequired();

    builder.Property(bp => bp.WeightKg)
      .IsRequired();

    builder.Property(bp => bp.PreferredFoot)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(bp => bp.Pace)
      .IsRequired();

    builder.Property(bp => bp.Stamina)
      .IsRequired();

    builder.Property(bp => bp.Strength)
      .IsRequired();

    builder.Property(bp => bp.Balance)
      .IsRequired();

    builder.Property(bp => bp.Jumping)
      .IsRequired();

    builder.Property(bp => bp.Decisions)
      .IsRequired();

    builder.Property(bp => bp.Positioning)
      .IsRequired();

    builder.Property(bp => bp.Teamwork)
      .IsRequired();

    builder.Property(bp => bp.WorkRate)
      .IsRequired();

    builder.Property(bp => bp.Leadership)
      .IsRequired();

    builder.Property(bp => bp.Finishing)
      .IsRequired();

    builder.Property(bp => bp.OffTheBall)
      .IsRequired();

    builder.Property(bp => bp.Crossing)
      .IsRequired();

    builder.Property(bp => bp.LongShots)
      .IsRequired();

    builder.Property(bp => bp.Composure)
      .IsRequired();

    builder.Property(bp => bp.Passing)
      .IsRequired();

    builder.Property(bp => bp.Technique)
      .IsRequired();

    builder.Property(bp => bp.FirstTouch)
      .IsRequired();

    builder.Property(bp => bp.Dribbling)
      .IsRequired();

    builder.Property(bp => bp.Vision)
      .IsRequired();

    builder.Property(bp => bp.Tackling)
      .IsRequired();

    builder.Property(bp => bp.Marking)
      .IsRequired();

    builder.Property(bp => bp.Heading)
      .IsRequired();

    builder.Property(bp => bp.Bravery)
      .IsRequired();

    builder.Property(bp => bp.Concentration)
      .IsRequired();

    builder.Property(bp => bp.Reflexes)
      .IsRequired();

    builder.Property(bp => bp.OneOnOnes)
      .IsRequired();

    builder.Property(bp => bp.Handling)
      .IsRequired();

    builder.Property(bp => bp.RushingOut)
      .IsRequired();

    builder.Property(bp => bp.Distribution)
      .IsRequired();

    builder.Property(bp => bp.AttackPower)
      .IsRequired();

    builder.Property(bp => bp.DefenseStrength)
      .IsRequired();

    builder.Property(bp => bp.MidfieldControl)
      .IsRequired();

    builder.Property(bp => bp.DraftTier)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(bp => bp.DraftFee)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(bp => bp.Wage)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(bp => bp.MarketValue)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(bp => bp.IsFreeAgentTemplate)
      .HasDefaultValue(false)
      .IsRequired();

    builder.Property(bp => bp.IsDraftOnly)
      .HasDefaultValue(false)
      .IsRequired();

    builder.HasIndex(bp => new { bp.Position, bp.Age, bp.Nationality });
    builder.HasIndex(bp => bp.DraftTier);
    builder.HasIndex(bp => bp.IsFreeAgentTemplate);
    builder.HasIndex(bp => bp.IsDraftOnly);
  }
}
