using System.Reflection;
using Api.Features.BasePlayers;
using Api.Core.Helpers;
using Api.Features.BaseBotClubs;
using Api.Features.ClubDrafts;
using Api.Features.ClubLineups;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.Facilities;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Api.Features.Referees;
using Api.Features.Roles;
using Api.Features.Transfers;
using Api.Features.Bribery;
using Api.Features.Actions;
using Api.Features.LeaguePress;
using Api.Features.Users;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class BaseDbContext : DbContext
{
  public BaseDbContext(DbContextOptions<BaseDbContext> options) : base(options)
  {

  }

  public DbSet<Role> Roles { get; set; }
  public DbSet<User> Users { get; set; }
  public DbSet<ClubPresident> ClubPresidents { get; set; }
  public DbSet<LeagueDivision> LeagueDivisions { get; set; }
  public DbSet<Club> Clubs { get; set; }
  public DbSet<ClubLineup> ClubLineups { get; set; }
  public DbSet<ClubLineupSelection> ClubLineupSelections { get; set; }
  public DbSet<BasePlayer> BasePlayers { get; set; }
  public DbSet<BaseBotClub> BaseBotClubs { get; set; }
  public DbSet<ClubDraftPick> ClubDraftPicks { get; set; }
  public DbSet<PlayerInstance> PlayerInstances { get; set; }
  public DbSet<Referee> Referees { get; set; }
  public DbSet<Match> Matches { get; set; }
  public DbSet<TransferListing> TransferListings { get; set; }
  public DbSet<TransferOffer> TransferOffers { get; set; }
  public DbSet<BribeAttempt> BribeAttempts { get; set; }
  public DbSet<ClubFacility> ClubFacilities { get; set; }
  public DbSet<ClubAction> ClubActions { get; set; }
  public DbSet<NewsArticle> NewsArticles { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
      var primaryKey = entityType.FindPrimaryKey();

      if (primaryKey != null && primaryKey.Properties.Count == 1)
      {
        var pkProperty = primaryKey.Properties[0];

        if (pkProperty.ClrType == typeof(Guid))
        {
          pkProperty.SetValueGeneratorFactory((_, _) => new GuidV7ValueGenerator());
        }
      }
    }
  }
}