using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Actions;

public class ClubActionConfiguration : IEntityTypeConfiguration<ClubAction>
{
  public void Configure(EntityTypeBuilder<ClubAction> builder)
  {
    builder.ToTable("ClubActions");

    builder.HasKey(a => a.Id);

    builder.Property(a => a.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(a => a.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(a => a.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(a => a.ActionType)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(a => a.Outcome)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(a => a.WasDetected)
      .HasDefaultValue(false)
      .IsRequired();

    builder.Property(a => a.HeatGenerated)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(a => a.CashSpent)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(a => a.SuccessChance)
      .HasPrecision(5, 4)
      .IsRequired();

    builder.Property(a => a.DetectionChance)
      .HasPrecision(5, 4)
      .IsRequired();

    builder.Property(a => a.ClubId)
      .IsRequired();

    builder.Property(a => a.MatchId)
      .IsRequired(false);

    builder.Property(a => a.TargetPlayerInstanceId)
      .IsRequired(false);

    builder.HasOne(a => a.Club)
      .WithMany()
      .HasForeignKey(a => a.ClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(a => a.Match)
      .WithMany()
      .HasForeignKey(a => a.MatchId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(a => a.TargetPlayerInstance)
      .WithMany()
      .HasForeignKey(a => a.TargetPlayerInstanceId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(a => a.ClubId);
    builder.HasIndex(a => new { a.ClubId, a.ActionType });
    builder.HasIndex(a => new { a.ClubId, a.MatchId });
    builder.HasIndex(a => a.MatchId);
    builder.HasIndex(a => new { a.ClubId, a.TargetPlayerInstanceId, a.ActionType });
  }
}
