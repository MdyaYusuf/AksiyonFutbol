using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Transfers;

public class TransferListingConfiguration : IEntityTypeConfiguration<TransferListing>
{
  public void Configure(EntityTypeBuilder<TransferListing> builder)
  {
    builder.ToTable("TransferListings");

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

    builder.Property(l => l.AskingPrice)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(l => l.Status)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(l => l.PlayerInstanceId)
      .IsRequired();

    builder.Property(l => l.ClubId)
      .IsRequired();

    builder.HasOne(l => l.PlayerInstance)
      .WithMany()
      .HasForeignKey(l => l.PlayerInstanceId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(l => l.Club)
      .WithMany()
      .HasForeignKey(l => l.ClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasMany(l => l.Offers)
      .WithOne(o => o.TransferListing)
      .HasForeignKey(o => o.TransferListingId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(l => l.PlayerInstanceId);
    builder.HasIndex(l => l.ClubId);
    builder.HasIndex(l => new { l.PlayerInstanceId, l.Status });
  }
}
