using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.PlayerInstances;

public class PlayerInstanceConfiguration : IEntityTypeConfiguration<PlayerInstance>
{
  public void Configure(EntityTypeBuilder<PlayerInstance> builder)
  {
    builder.ToTable("PlayerInstances");

    builder.HasKey(pi => pi.Id);

    builder.Property(pi => pi.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(pi => pi.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(pi => pi.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(pi => pi.FirstName)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(pi => pi.LastName)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(pi => pi.Nationality)
      .HasMaxLength(50)
      .IsRequired(false);

    builder.Property(pi => pi.Position)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(pi => pi.Age)
      .IsRequired();

    builder.Property(pi => pi.HeightCm)
      .IsRequired();

    builder.Property(pi => pi.WeightKg)
      .IsRequired();

    builder.Property(pi => pi.PreferredFoot)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(pi => pi.Pace)
      .IsRequired();

    builder.Property(pi => pi.Stamina)
      .IsRequired();

    builder.Property(pi => pi.Strength)
      .IsRequired();

    builder.Property(pi => pi.Balance)
      .IsRequired();

    builder.Property(pi => pi.Jumping)
      .IsRequired();

    builder.Property(pi => pi.Decisions)
      .IsRequired();

    builder.Property(pi => pi.Positioning)
      .IsRequired();

    builder.Property(pi => pi.Teamwork)
      .IsRequired();

    builder.Property(pi => pi.WorkRate)
      .IsRequired();

    builder.Property(pi => pi.Leadership)
      .IsRequired();

    builder.Property(pi => pi.Finishing)
      .IsRequired();

    builder.Property(pi => pi.OffTheBall)
      .IsRequired();

    builder.Property(pi => pi.Crossing)
      .IsRequired();

    builder.Property(pi => pi.LongShots)
      .IsRequired();

    builder.Property(pi => pi.Composure)
      .IsRequired();

    builder.Property(pi => pi.Passing)
      .IsRequired();

    builder.Property(pi => pi.Technique)
      .IsRequired();

    builder.Property(pi => pi.FirstTouch)
      .IsRequired();

    builder.Property(pi => pi.Dribbling)
      .IsRequired();

    builder.Property(pi => pi.Vision)
      .IsRequired();

    builder.Property(pi => pi.Tackling)
      .IsRequired();

    builder.Property(pi => pi.Marking)
      .IsRequired();

    builder.Property(pi => pi.Heading)
      .IsRequired();

    builder.Property(pi => pi.Bravery)
      .IsRequired();

    builder.Property(pi => pi.Concentration)
      .IsRequired();

    builder.Property(pi => pi.Reflexes)
      .IsRequired();

    builder.Property(pi => pi.OneOnOnes)
      .IsRequired();

    builder.Property(pi => pi.Handling)
      .IsRequired();

    builder.Property(pi => pi.RushingOut)
      .IsRequired();

    builder.Property(pi => pi.Distribution)
      .IsRequired();

    builder.Property(pi => pi.AttackPower)
      .IsRequired();

    builder.Property(pi => pi.DefenseStrength)
      .IsRequired();

    builder.Property(pi => pi.MidfieldControl)
      .IsRequired();

    builder.Property(pi => pi.IsInjured)
      .HasDefaultValue(false)
      .IsRequired();

    builder.Property(pi => pi.InjuryDays)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(pi => pi.SeasonGoals)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(pi => pi.SeasonAssists)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(pi => pi.SeasonYellowCards)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(pi => pi.SeasonRedCards)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(pi => pi.MarketValue)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(pi => pi.Wage)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(pi => pi.ClubId)
      .IsRequired();

    builder.Property(pi => pi.BasePlayerId)
      .IsRequired(false);

    builder.HasOne(pi => pi.Club)
      .WithMany(c => c.Players)
      .HasForeignKey(pi => pi.ClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(pi => pi.BasePlayer)
      .WithMany(bp => bp.PlayerInstances)
      .HasForeignKey(pi => pi.BasePlayerId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(pi => pi.ClubId);
    builder.HasIndex(pi => pi.BasePlayerId);
    builder.HasIndex(pi => pi.Position);
    builder.HasIndex(pi => new { pi.ClubId, pi.Position });
  }
}
