using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.LeagueDivisions;

public class LeagueDivisionConfiguration : IEntityTypeConfiguration<LeagueDivision>
{
  public void Configure(EntityTypeBuilder<LeagueDivision> builder)
  {
    builder.ToTable("LeagueDivisions");

    builder.HasKey(ld => ld.Id);

    builder.Property(ld => ld.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(ld => ld.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(ld => ld.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(ld => ld.Name)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(ld => ld.Tier)
      .IsRequired();

    builder.Property(ld => ld.GroupNumber)
      .IsRequired();

    builder.Property(ld => ld.CurrentMatchWeek)
      .HasDefaultValue(1)
      .IsRequired();

    builder.Property(ld => ld.CurrentSeason)
      .HasDefaultValue(1)
      .IsRequired();

    builder.Property(ld => ld.IsTutorial)
      .HasDefaultValue(false)
      .IsRequired();

    builder.Property(ld => ld.OwnerUserId)
      .IsRequired(false);

    builder.Property(ld => ld.LifecycleStatus)
      .HasConversion<int>()
      .HasDefaultValue(DivisionLifecycleStatus.Active)
      .HasSentinel((DivisionLifecycleStatus)0)
      .IsRequired();

    builder.HasIndex(ld => ld.Name)
      .IsUnique();

    // Competitive divisions keep unique (Tier, GroupNumber); tutorial instances do not.
    builder.HasIndex(ld => new { ld.Tier, ld.GroupNumber })
      .IsUnique()
      .HasFilter("[IsTutorial] = 0");

    builder.HasIndex(ld => ld.OwnerUserId)
      .IsUnique()
      .HasFilter("[IsTutorial] = 1 AND [OwnerUserId] IS NOT NULL");

    builder.HasIndex(ld => ld.IsTutorial);
    builder.HasIndex(ld => ld.LifecycleStatus);
  }
}
