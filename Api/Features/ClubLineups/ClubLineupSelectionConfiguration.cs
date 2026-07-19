using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.ClubLineups;

public class ClubLineupSelectionConfiguration : IEntityTypeConfiguration<ClubLineupSelection>
{
  public void Configure(EntityTypeBuilder<ClubLineupSelection> builder)
  {
    builder.ToTable("ClubLineupSelections");

    builder.HasKey(s => s.Id);

    builder.Property(s => s.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(s => s.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(s => s.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(s => s.IsStarter)
      .IsRequired();

    builder.Property(s => s.SortOrder)
      .IsRequired();

    builder.Property(s => s.ClubLineupId)
      .IsRequired();

    builder.Property(s => s.PlayerInstanceId)
      .IsRequired();

    builder.HasOne(s => s.PlayerInstance)
      .WithMany()
      .HasForeignKey(s => s.PlayerInstanceId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(s => new { s.ClubLineupId, s.PlayerInstanceId })
      .IsUnique();

    builder.HasIndex(s => new { s.ClubLineupId, s.IsStarter, s.SortOrder });
  }
}
