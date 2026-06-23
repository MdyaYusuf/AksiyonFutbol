using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Referees;

public class RefereeConfiguration : IEntityTypeConfiguration<Referee>
{
  public void Configure(EntityTypeBuilder<Referee> builder)
  {
    builder.ToTable("Referees");

    builder.HasKey(r => r.Id);

    builder.Property(r => r.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(r => r.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(r => r.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(r => r.Name)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(r => r.BriberyDifficulty)
      .IsRequired();

    builder.Property(r => r.PersonalityType)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(r => r.Biography)
      .HasMaxLength(1000)
      .IsRequired(false);

    builder.HasIndex(r => r.Name)
      .IsUnique();

    builder.HasIndex(r => r.PersonalityType);
    builder.HasIndex(r => r.BriberyDifficulty);
  }
}
