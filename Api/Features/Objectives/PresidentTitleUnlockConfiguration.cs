using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Objectives;

public class PresidentTitleUnlockConfiguration : IEntityTypeConfiguration<PresidentTitleUnlock>
{
  public void Configure(EntityTypeBuilder<PresidentTitleUnlock> builder)
  {
    builder.ToTable("PresidentTitleUnlocks");

    builder.HasKey(t => t.Id);

    builder.Property(t => t.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(t => t.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(t => t.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(t => t.PresidentId)
      .IsRequired();

    builder.Property(t => t.TitleKey)
      .HasMaxLength(80)
      .IsRequired();

    builder.Property(t => t.DisplayName)
      .HasMaxLength(120)
      .IsRequired();

    builder.Property(t => t.Source)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(t => t.UnlockedDate)
      .IsRequired();

    builder.HasOne(t => t.President)
      .WithMany()
      .HasForeignKey(t => t.PresidentId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(t => new { t.PresidentId, t.TitleKey })
      .IsUnique();

    builder.HasIndex(t => t.PresidentId);
  }
}
