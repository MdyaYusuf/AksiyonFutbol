using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.LeaguePress;

public class NewsArticleConfiguration : IEntityTypeConfiguration<NewsArticle>
{
  public void Configure(EntityTypeBuilder<NewsArticle> builder)
  {
    builder.ToTable("NewsArticles");

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

    builder.Property(a => a.DivisionId)
      .IsRequired();

    builder.Property(a => a.Season)
      .IsRequired();

    builder.Property(a => a.MatchWeek)
      .IsRequired(false);

    builder.Property(a => a.SubjectClubId)
      .IsRequired(false);

    builder.Property(a => a.Kind)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(a => a.Tone)
      .HasConversion<int>()
      .IsRequired();

    builder.Property(a => a.Headline)
      .HasMaxLength(300)
      .IsRequired();

    builder.Property(a => a.Body)
      .HasMaxLength(4000)
      .IsRequired();

    builder.Property(a => a.SourceMatchId)
      .IsRequired(false);

    builder.Property(a => a.SourceClubActionId)
      .IsRequired(false);

    builder.Property(a => a.SourceBribeAttemptId)
      .IsRequired(false);

    builder.HasOne(a => a.SubjectClub)
      .WithMany()
      .HasForeignKey(a => a.SubjectClubId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(a => a.DivisionId);
    builder.HasIndex(a => new { a.DivisionId, a.CreatedDate });

    builder.HasIndex(a => a.SourceMatchId)
      .IsUnique()
      .HasFilter("[SourceMatchId] IS NOT NULL");

    builder.HasIndex(a => a.SourceClubActionId)
      .IsUnique()
      .HasFilter("[SourceClubActionId] IS NOT NULL");

    builder.HasIndex(a => a.SourceBribeAttemptId)
      .IsUnique()
      .HasFilter("[SourceBribeAttemptId] IS NOT NULL");
  }
}
