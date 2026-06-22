using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.BasePlayers;

public class BasePlayerConfiguration : IEntityTypeConfiguration<BasePlayer>
{
  public void Configure(EntityTypeBuilder<BasePlayer> builder)
  {
    builder.ToTable("BasePlayers");

    builder.HasKey(bp => bp.Id);

    builder.Property(bp => bp.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(bp => bp.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(bp => bp.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(bp => bp.DefaultFirstName)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(bp => bp.DefaultLastName)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(bp => bp.Nationality)
      .HasMaxLength(50)
      .IsRequired(false);

    builder.Property(bp => bp.Position)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(bp => bp.Age)
      .IsRequired();

    builder.Property(bp => bp.AttackPower)
      .IsRequired();

    builder.Property(bp => bp.DefenseStrength)
      .IsRequired();

    builder.Property(bp => bp.MidfieldControl)
      .IsRequired();

    builder.HasIndex(bp => new { bp.Position, bp.Age, bp.Nationality });
  }
}
