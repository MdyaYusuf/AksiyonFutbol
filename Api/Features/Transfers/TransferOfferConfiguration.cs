using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Transfers;

public class TransferOfferConfiguration : IEntityTypeConfiguration<TransferOffer>
{
  public void Configure(EntityTypeBuilder<TransferOffer> builder)
  {
    builder.ToTable("TransferOffers");

    builder.HasKey(o => o.Id);

    builder.Property(o => o.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(o => o.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(o => o.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(o => o.OfferFee)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(o => o.ProposedWage)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(o => o.Status)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(o => o.TransferListingId)
      .IsRequired();

    builder.Property(o => o.BuyingClubId)
      .IsRequired();

    builder.HasOne(o => o.BuyingClub)
      .WithMany()
      .HasForeignKey(o => o.BuyingClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(o => o.TransferListingId);
    builder.HasIndex(o => o.BuyingClubId);
    builder.HasIndex(o => new { o.BuyingClubId, o.Status });
  }
}
