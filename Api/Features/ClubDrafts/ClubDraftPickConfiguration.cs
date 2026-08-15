using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.ClubDrafts;

public class ClubDraftPickConfiguration : IEntityTypeConfiguration<ClubDraftPick>
{
  public void Configure(EntityTypeBuilder<ClubDraftPick> builder)
  {
    builder.ToTable("ClubDraftPicks");

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

    builder.Property(p => p.BasePlayerId)
      .IsRequired();

    builder.Property(p => p.PickOrder)
      .IsRequired();

    builder.HasOne(p => p.Club)
      .WithMany(c => c.DraftPicks)
      .HasForeignKey(p => p.ClubId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne(p => p.BasePlayer)
      .WithMany()
      .HasForeignKey(p => p.BasePlayerId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(p => new { p.ClubId, p.BasePlayerId })
      .IsUnique();

    builder.HasIndex(p => new { p.ClubId, p.PickOrder })
      .IsUnique();
  }
}
