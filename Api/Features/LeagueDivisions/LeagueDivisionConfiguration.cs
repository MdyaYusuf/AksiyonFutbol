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

    builder.HasIndex(ld => ld.Name)
      .IsUnique();

    builder.HasIndex(ld => new { ld.Tier, ld.GroupNumber })
      .IsUnique();
  }
}
