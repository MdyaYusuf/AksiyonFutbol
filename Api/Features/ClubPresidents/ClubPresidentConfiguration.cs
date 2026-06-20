using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.ClubPresidents;

public class ClubPresidentConfiguration : IEntityTypeConfiguration<ClubPresident>
{
  public void Configure(EntityTypeBuilder<ClubPresident> builder)
  {
    builder.ToTable("ClubPresidents");

    builder.HasKey(cp => cp.Id);

    builder.Property(cp => cp.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(cp => cp.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(cp => cp.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(cp => cp.UserId)
      .IsRequired();

    builder.Property(cp => cp.Name)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(cp => cp.ReputationPoints)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(cp => cp.Title)
      .HasMaxLength(50)
      .HasDefaultValue("Amateur")
      .IsRequired(false);

    builder.HasOne(cp => cp.User)
      .WithOne()
      .HasForeignKey<ClubPresident>(cp => cp.UserId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(cp => cp.UserId)
      .IsUnique();

    builder.HasIndex(cp => cp.Name)
      .IsUnique();
  }
}
