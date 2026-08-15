using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.BaseBotClubs;

public class BaseBotClubConfiguration : IEntityTypeConfiguration<BaseBotClub>
{
  public void Configure(EntityTypeBuilder<BaseBotClub> builder)
  {
    builder.ToTable("BaseBotClubs");

    builder.HasKey(b => b.Id);

    builder.Property(b => b.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(b => b.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(b => b.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(b => b.Name)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(b => b.StartingMorale)
      .HasDefaultValue(50)
      .IsRequired();

    builder.Property(b => b.StartingChemistry)
      .HasDefaultValue(50)
      .IsRequired();

    builder.Property(b => b.StartingDiscipline)
      .HasDefaultValue(50)
      .IsRequired();

    builder.Property(b => b.PreferredFormation)
      .HasConversion<int?>()
      .IsRequired(false);

    builder.Property(b => b.IsTutorialTemplate)
      .HasDefaultValue(false)
      .IsRequired();

    builder.HasIndex(b => b.Name)
      .IsUnique();

    builder.HasIndex(b => b.IsTutorialTemplate);
  }
}
