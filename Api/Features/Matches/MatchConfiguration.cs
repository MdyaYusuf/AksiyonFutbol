using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Matches;

public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
  public void Configure(EntityTypeBuilder<Match> builder)
  {
    builder.ToTable("Matches");

    builder.HasKey(m => m.Id);

    builder.Property(m => m.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(m => m.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(m => m.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(m => m.MatchWeek)
      .IsRequired();

    builder.Property(m => m.MatchDate)
      .IsRequired();

    builder.Property(m => m.IsPlayed)
      .HasDefaultValue(false)
      .IsRequired();

    builder.Property(m => m.HomeScore)
      .IsRequired(false);

    builder.Property(m => m.AwayScore)
      .IsRequired(false);

    builder.Property(m => m.MatchLogJson)
      .IsRequired(false);

    builder.Property(m => m.HomeCashBefore)
      .HasColumnType("decimal(18,2)")
      .IsRequired(false);

    builder.Property(m => m.AwayCashBefore)
      .HasColumnType("decimal(18,2)")
      .IsRequired(false);

    builder.Property(m => m.HomeMoraleBefore)
      .IsRequired(false);

    builder.Property(m => m.AwayMoraleBefore)
      .IsRequired(false);

    builder.Property(m => m.HomeSuspicionBefore)
      .IsRequired(false);

    builder.Property(m => m.AwaySuspicionBefore)
      .IsRequired(false);

    builder.Property(m => m.DivisionId)
      .IsRequired();

    builder.Property(m => m.HomeClubId)
      .IsRequired();

    builder.Property(m => m.AwayClubId)
      .IsRequired();

    builder.Property(m => m.RefereeId)
      .IsRequired(false);

    builder.HasOne(m => m.Division)
      .WithMany()
      .HasForeignKey(m => m.DivisionId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(m => m.HomeClub)
      .WithMany()
      .HasForeignKey(m => m.HomeClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(m => m.AwayClub)
      .WithMany()
      .HasForeignKey(m => m.AwayClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(m => m.Referee)
      .WithMany()
      .HasForeignKey(m => m.RefereeId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(m => new { m.DivisionId, m.MatchWeek });
    builder.HasIndex(m => m.MatchDate);
    builder.HasIndex(m => m.IsPlayed);
    builder.HasIndex(m => m.HomeClubId);
    builder.HasIndex(m => m.AwayClubId);
    builder.HasIndex(m => new { m.DivisionId, m.MatchWeek, m.HomeClubId, m.AwayClubId })
      .IsUnique();
  }
}
