using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Objectives;

public class ClubObjectiveProgressConfiguration : IEntityTypeConfiguration<ClubObjectiveProgress>
{
  public void Configure(EntityTypeBuilder<ClubObjectiveProgress> builder)
  {
    builder.ToTable("ClubObjectiveProgresses");

    builder.HasKey(p => p.Id);

    builder.Property(p => p.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(p => p.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(p => p.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(p => p.ClubId)
      .IsRequired();

    builder.Property(p => p.ObjectiveKey)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(p => p.CurrentValue)
      .IsRequired();

    builder.Property(p => p.TargetValue)
      .IsRequired();

    builder.Property(p => p.Status)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(p => p.CompletedDate)
      .IsRequired(false);

    builder.Property(p => p.ClaimedDate)
      .IsRequired(false);

    builder.HasOne(p => p.Club)
      .WithMany()
      .HasForeignKey(p => p.ClubId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(p => new { p.ClubId, p.ObjectiveKey })
      .IsUnique();

    builder.HasIndex(p => p.ClubId);
  }
}
