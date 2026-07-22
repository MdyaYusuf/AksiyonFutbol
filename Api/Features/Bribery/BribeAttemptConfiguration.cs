using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Bribery;

public class BribeAttemptConfiguration : IEntityTypeConfiguration<BribeAttempt>
{
  public void Configure(EntityTypeBuilder<BribeAttempt> builder)
  {
    builder.ToTable("BribeAttempts");

    builder.HasKey(a => a.Id);

    builder.Property(a => a.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(a => a.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(a => a.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(a => a.Amount)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(a => a.SuccessChance)
      .HasPrecision(5, 4)
      .IsRequired();

    builder.Property(a => a.Outcome)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(a => a.ClubId)
      .IsRequired();

    builder.Property(a => a.MatchId)
      .IsRequired();

    builder.Property(a => a.RefereeId)
      .IsRequired();

    builder.HasOne(a => a.Club)
      .WithMany()
      .HasForeignKey(a => a.ClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(a => a.Match)
      .WithMany()
      .HasForeignKey(a => a.MatchId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasOne(a => a.Referee)
      .WithMany()
      .HasForeignKey(a => a.RefereeId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(a => new { a.ClubId, a.MatchId })
      .IsUnique();

    builder.HasIndex(a => a.MatchId);
    builder.HasIndex(a => a.ClubId);
  }
}
