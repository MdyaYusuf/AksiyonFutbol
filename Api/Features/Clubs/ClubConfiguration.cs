using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Features.LeagueDivisions;

namespace Api.Features.Clubs;

public class ClubConfiguration : IEntityTypeConfiguration<Club>
{
  public void Configure(EntityTypeBuilder<Club> builder)
  {
    builder.ToTable("Clubs");

    builder.HasKey(c => c.Id);

    builder.Property(c => c.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(c => c.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(c => c.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(c => c.Name)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(c => c.IsBot)
      .HasDefaultValue(false)
      .IsRequired();

    builder.Property(c => c.Cash)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(c => c.WageBudget)
      .HasPrecision(18, 2)
      .HasDefaultValue(0m)
      .IsRequired();

    builder.Property(c => c.Morale)
      .HasDefaultValue(50)
      .IsRequired();

    builder.Property(c => c.Chemistry)
      .HasDefaultValue(50)
      .IsRequired();

    builder.Property(c => c.Discipline)
      .HasDefaultValue(50)
      .IsRequired();

    builder.Property(c => c.Suspicion)
      .HasDefaultValue(0)
      .IsRequired();

    builder.Property(c => c.LifecycleStatus)
      .HasConversion<int>()
      .HasDefaultValue(ClubLifecycleStatus.Drafting)
      .HasSentinel((ClubLifecycleStatus)0)
      .IsRequired();

    builder.Property(c => c.PlacementTargetTier)
      .HasConversion<int?>()
      .IsRequired(false);

    builder.Property(c => c.PresidentId)
      .IsRequired(false);

    builder.Property(c => c.DivisionId)
      .IsRequired(false);

    builder.Property(c => c.TutorialDivisionId)
      .IsRequired(false);

    builder.HasOne(c => c.President)
      .WithOne(cp => cp.Club)
      .HasForeignKey<Club>(c => c.PresidentId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(c => c.Division)
      .WithMany(ld => ld.Clubs)
      .HasForeignKey(c => c.DivisionId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(c => c.TutorialDivision)
      .WithMany()
      .HasForeignKey(c => c.TutorialDivisionId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(c => c.Name)
      .IsUnique();

    builder.HasIndex(c => c.PresidentId)
      .IsUnique()
      .HasFilter("[PresidentId] IS NOT NULL");

    builder.HasIndex(c => c.DivisionId);
    builder.HasIndex(c => c.TutorialDivisionId);
    builder.HasIndex(c => c.LifecycleStatus);
    builder.HasIndex(c => c.PlacementTargetTier);
  }
}
