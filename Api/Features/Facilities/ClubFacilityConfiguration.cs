using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Facilities;

public class ClubFacilityConfiguration : IEntityTypeConfiguration<ClubFacility>
{
  public void Configure(EntityTypeBuilder<ClubFacility> builder)
  {
    builder.ToTable("ClubFacilities");

    builder.HasKey(f => f.Id);

    builder.Property(f => f.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(f => f.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(f => f.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(f => f.FacilityType)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(f => f.Level)
      .IsRequired();

    builder.Property(f => f.ClubId)
      .IsRequired();

    builder.HasOne(f => f.Club)
      .WithMany(c => c.Facilities)
      .HasForeignKey(f => f.ClubId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(f => new { f.ClubId, f.FacilityType })
      .IsUnique();

    builder.HasIndex(f => f.ClubId);
  }
}
