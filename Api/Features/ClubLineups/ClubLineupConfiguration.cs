using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.ClubLineups;

public class ClubLineupConfiguration : IEntityTypeConfiguration<ClubLineup>
{
  public void Configure(EntityTypeBuilder<ClubLineup> builder)
  {
    builder.ToTable("ClubLineups");

    builder.HasKey(l => l.Id);

    builder.Property(l => l.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(l => l.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(l => l.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(l => l.Formation)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(l => l.Mentality)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(l => l.ClubId)
      .IsRequired();

    builder.HasOne(l => l.Club)
      .WithOne(c => c.Lineup)
      .HasForeignKey<ClubLineup>(l => l.ClubId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasMany(l => l.Selections)
      .WithOne(s => s.ClubLineup)
      .HasForeignKey(s => s.ClubLineupId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(l => l.ClubId)
      .IsUnique();
  }
}
