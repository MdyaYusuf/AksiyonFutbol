using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaseBotClubs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartingMorale = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    StartingChemistry = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    StartingDiscipline = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    PreferredFormation = table.Column<int>(type: "int", nullable: true),
                    IsTutorialTemplate = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaseBotClubs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BasePlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DefaultFirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DefaultLastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Nationality = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Position = table.Column<int>(type: "int", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    HeightCm = table.Column<int>(type: "int", nullable: false),
                    WeightKg = table.Column<int>(type: "int", nullable: false),
                    PreferredFoot = table.Column<int>(type: "int", nullable: false),
                    Pace = table.Column<int>(type: "int", nullable: false),
                    Stamina = table.Column<int>(type: "int", nullable: false),
                    Strength = table.Column<int>(type: "int", nullable: false),
                    Balance = table.Column<int>(type: "int", nullable: false),
                    Jumping = table.Column<int>(type: "int", nullable: false),
                    Decisions = table.Column<int>(type: "int", nullable: false),
                    Positioning = table.Column<int>(type: "int", nullable: false),
                    Teamwork = table.Column<int>(type: "int", nullable: false),
                    WorkRate = table.Column<int>(type: "int", nullable: false),
                    Leadership = table.Column<int>(type: "int", nullable: false),
                    Finishing = table.Column<int>(type: "int", nullable: false),
                    OffTheBall = table.Column<int>(type: "int", nullable: false),
                    Crossing = table.Column<int>(type: "int", nullable: false),
                    LongShots = table.Column<int>(type: "int", nullable: false),
                    Composure = table.Column<int>(type: "int", nullable: false),
                    Passing = table.Column<int>(type: "int", nullable: false),
                    Technique = table.Column<int>(type: "int", nullable: false),
                    FirstTouch = table.Column<int>(type: "int", nullable: false),
                    Dribbling = table.Column<int>(type: "int", nullable: false),
                    Vision = table.Column<int>(type: "int", nullable: false),
                    Tackling = table.Column<int>(type: "int", nullable: false),
                    Marking = table.Column<int>(type: "int", nullable: false),
                    Heading = table.Column<int>(type: "int", nullable: false),
                    Bravery = table.Column<int>(type: "int", nullable: false),
                    Concentration = table.Column<int>(type: "int", nullable: false),
                    Reflexes = table.Column<int>(type: "int", nullable: false),
                    OneOnOnes = table.Column<int>(type: "int", nullable: false),
                    Handling = table.Column<int>(type: "int", nullable: false),
                    RushingOut = table.Column<int>(type: "int", nullable: false),
                    Distribution = table.Column<int>(type: "int", nullable: false),
                    AttackPower = table.Column<int>(type: "int", nullable: false),
                    DefenseStrength = table.Column<int>(type: "int", nullable: false),
                    MidfieldControl = table.Column<int>(type: "int", nullable: false),
                    DraftTier = table.Column<int>(type: "int", nullable: false),
                    DraftFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    Wage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    MarketValue = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    IsFreeAgentTemplate = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsDraftOnly = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BasePlayers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeagueDivisions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tier = table.Column<int>(type: "int", nullable: false),
                    GroupNumber = table.Column<int>(type: "int", nullable: false),
                    CurrentMatchWeek = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CurrentSeason = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    IsTutorial = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    OwnerUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LifecycleStatus = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeagueDivisions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Referees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BriberyDifficulty = table.Column<int>(type: "int", nullable: false),
                    PersonalityType = table.Column<int>(type: "int", nullable: false),
                    Biography = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Referees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    RefreshTokenExpiration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClubPresidents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReputationPoints = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "Amateur"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubPresidents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubPresidents_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Clubs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsBot = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Cash = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    WageBudget = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    Morale = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    Chemistry = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    Discipline = table.Column<int>(type: "int", nullable: false, defaultValue: 50),
                    Suspicion = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    LifecycleStatus = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    PlacementTargetTier = table.Column<int>(type: "int", nullable: true),
                    TutorialDivisionId = table.Column<int>(type: "int", nullable: true),
                    PresidentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DivisionId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clubs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clubs_ClubPresidents_PresidentId",
                        column: x => x.PresidentId,
                        principalTable: "ClubPresidents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clubs_LeagueDivisions_DivisionId",
                        column: x => x.DivisionId,
                        principalTable: "LeagueDivisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clubs_LeagueDivisions_TutorialDivisionId",
                        column: x => x.TutorialDivisionId,
                        principalTable: "LeagueDivisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClubDraftPicks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BasePlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PickOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubDraftPicks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubDraftPicks_BasePlayers_BasePlayerId",
                        column: x => x.BasePlayerId,
                        principalTable: "BasePlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClubDraftPicks_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClubFacilities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FacilityType = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubFacilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubFacilities_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClubLineups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Formation = table.Column<int>(type: "int", nullable: false),
                    Mentality = table.Column<int>(type: "int", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubLineups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubLineups_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MatchWeek = table.Column<int>(type: "int", nullable: false),
                    Season = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    MatchDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsPlayed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    HomeScore = table.Column<int>(type: "int", nullable: true),
                    AwayScore = table.Column<int>(type: "int", nullable: true),
                    MatchLogJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HomeCashBefore = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AwayCashBefore = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HomeMoraleBefore = table.Column<int>(type: "int", nullable: true),
                    AwayMoraleBefore = table.Column<int>(type: "int", nullable: true),
                    HomeSuspicionBefore = table.Column<int>(type: "int", nullable: true),
                    AwaySuspicionBefore = table.Column<int>(type: "int", nullable: true),
                    DivisionId = table.Column<int>(type: "int", nullable: false),
                    HomeClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AwayClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RefereeId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Matches_Clubs_AwayClubId",
                        column: x => x.AwayClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Clubs_HomeClubId",
                        column: x => x.HomeClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_LeagueDivisions_DivisionId",
                        column: x => x.DivisionId,
                        principalTable: "LeagueDivisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Referees_RefereeId",
                        column: x => x.RefereeId,
                        principalTable: "Referees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PlayerInstances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Nationality = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Position = table.Column<int>(type: "int", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    HeightCm = table.Column<int>(type: "int", nullable: false),
                    WeightKg = table.Column<int>(type: "int", nullable: false),
                    PreferredFoot = table.Column<int>(type: "int", nullable: false),
                    Pace = table.Column<int>(type: "int", nullable: false),
                    Stamina = table.Column<int>(type: "int", nullable: false),
                    Strength = table.Column<int>(type: "int", nullable: false),
                    Balance = table.Column<int>(type: "int", nullable: false),
                    Jumping = table.Column<int>(type: "int", nullable: false),
                    Decisions = table.Column<int>(type: "int", nullable: false),
                    Positioning = table.Column<int>(type: "int", nullable: false),
                    Teamwork = table.Column<int>(type: "int", nullable: false),
                    WorkRate = table.Column<int>(type: "int", nullable: false),
                    Leadership = table.Column<int>(type: "int", nullable: false),
                    Finishing = table.Column<int>(type: "int", nullable: false),
                    OffTheBall = table.Column<int>(type: "int", nullable: false),
                    Crossing = table.Column<int>(type: "int", nullable: false),
                    LongShots = table.Column<int>(type: "int", nullable: false),
                    Composure = table.Column<int>(type: "int", nullable: false),
                    Passing = table.Column<int>(type: "int", nullable: false),
                    Technique = table.Column<int>(type: "int", nullable: false),
                    FirstTouch = table.Column<int>(type: "int", nullable: false),
                    Dribbling = table.Column<int>(type: "int", nullable: false),
                    Vision = table.Column<int>(type: "int", nullable: false),
                    Tackling = table.Column<int>(type: "int", nullable: false),
                    Marking = table.Column<int>(type: "int", nullable: false),
                    Heading = table.Column<int>(type: "int", nullable: false),
                    Bravery = table.Column<int>(type: "int", nullable: false),
                    Concentration = table.Column<int>(type: "int", nullable: false),
                    Reflexes = table.Column<int>(type: "int", nullable: false),
                    OneOnOnes = table.Column<int>(type: "int", nullable: false),
                    Handling = table.Column<int>(type: "int", nullable: false),
                    RushingOut = table.Column<int>(type: "int", nullable: false),
                    Distribution = table.Column<int>(type: "int", nullable: false),
                    AttackPower = table.Column<int>(type: "int", nullable: false),
                    DefenseStrength = table.Column<int>(type: "int", nullable: false),
                    MidfieldControl = table.Column<int>(type: "int", nullable: false),
                    IsInjured = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    InjuryDays = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SeasonGoals = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SeasonAssists = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SeasonYellowCards = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SeasonRedCards = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MarketValue = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    Wage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BasePlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerInstances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerInstances_BasePlayers_BasePlayerId",
                        column: x => x.BasePlayerId,
                        principalTable: "BasePlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlayerInstances_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BribeAttempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SuccessChance = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: false),
                    Outcome = table.Column<int>(type: "int", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RefereeId = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BribeAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BribeAttempts_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BribeAttempts_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BribeAttempts_Referees_RefereeId",
                        column: x => x.RefereeId,
                        principalTable: "Referees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClubActions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActionType = table.Column<int>(type: "int", nullable: false),
                    Outcome = table.Column<int>(type: "int", nullable: false),
                    WasDetected = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    HeatGenerated = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CashSpent = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SuccessChance = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: false),
                    DetectionChance = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: false),
                    FineAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    ScandalMoralePenaltyApplied = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ScandalReputationPenaltyApplied = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MatchPenaltyApplied = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TargetPlayerInstanceId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubActions_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClubActions_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClubActions_PlayerInstances_TargetPlayerInstanceId",
                        column: x => x.TargetPlayerInstanceId,
                        principalTable: "PlayerInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClubLineupSelections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsStarter = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    ClubLineupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayerInstanceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubLineupSelections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubLineupSelections_ClubLineups_ClubLineupId",
                        column: x => x.ClubLineupId,
                        principalTable: "ClubLineups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClubLineupSelections_PlayerInstances_PlayerInstanceId",
                        column: x => x.PlayerInstanceId,
                        principalTable: "PlayerInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TransferListings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AskingPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    PlayerInstanceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferListings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransferListings_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TransferListings_PlayerInstances_PlayerInstanceId",
                        column: x => x.PlayerInstanceId,
                        principalTable: "PlayerInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TransferOffers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OfferFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ProposedWage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TransferListingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BuyingClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferOffers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransferOffers_Clubs_BuyingClubId",
                        column: x => x.BuyingClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TransferOffers_TransferListings_TransferListingId",
                        column: x => x.TransferListingId,
                        principalTable: "TransferListings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaseBotClubs_IsTutorialTemplate",
                table: "BaseBotClubs",
                column: "IsTutorialTemplate");

            migrationBuilder.CreateIndex(
                name: "IX_BaseBotClubs_Name",
                table: "BaseBotClubs",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BasePlayers_DraftTier",
                table: "BasePlayers",
                column: "DraftTier");

            migrationBuilder.CreateIndex(
                name: "IX_BasePlayers_IsDraftOnly",
                table: "BasePlayers",
                column: "IsDraftOnly");

            migrationBuilder.CreateIndex(
                name: "IX_BasePlayers_IsFreeAgentTemplate",
                table: "BasePlayers",
                column: "IsFreeAgentTemplate");

            migrationBuilder.CreateIndex(
                name: "IX_BasePlayers_Position_Age_Nationality",
                table: "BasePlayers",
                columns: new[] { "Position", "Age", "Nationality" });

            migrationBuilder.CreateIndex(
                name: "IX_BribeAttempts_ClubId",
                table: "BribeAttempts",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_BribeAttempts_ClubId_MatchId",
                table: "BribeAttempts",
                columns: new[] { "ClubId", "MatchId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BribeAttempts_MatchId",
                table: "BribeAttempts",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_BribeAttempts_RefereeId",
                table: "BribeAttempts",
                column: "RefereeId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_ClubId",
                table: "ClubActions",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_ClubId_ActionType",
                table: "ClubActions",
                columns: new[] { "ClubId", "ActionType" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_ClubId_MatchId",
                table: "ClubActions",
                columns: new[] { "ClubId", "MatchId" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_ClubId_TargetPlayerInstanceId_ActionType",
                table: "ClubActions",
                columns: new[] { "ClubId", "TargetPlayerInstanceId", "ActionType" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_MatchId",
                table: "ClubActions",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_TargetPlayerInstanceId",
                table: "ClubActions",
                column: "TargetPlayerInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubDraftPicks_BasePlayerId",
                table: "ClubDraftPicks",
                column: "BasePlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubDraftPicks_ClubId_BasePlayerId",
                table: "ClubDraftPicks",
                columns: new[] { "ClubId", "BasePlayerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubDraftPicks_ClubId_PickOrder",
                table: "ClubDraftPicks",
                columns: new[] { "ClubId", "PickOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubFacilities_ClubId",
                table: "ClubFacilities",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubFacilities_ClubId_FacilityType",
                table: "ClubFacilities",
                columns: new[] { "ClubId", "FacilityType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubLineups_ClubId",
                table: "ClubLineups",
                column: "ClubId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubLineupSelections_ClubLineupId_IsStarter_SortOrder",
                table: "ClubLineupSelections",
                columns: new[] { "ClubLineupId", "IsStarter", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubLineupSelections_ClubLineupId_PlayerInstanceId",
                table: "ClubLineupSelections",
                columns: new[] { "ClubLineupId", "PlayerInstanceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubLineupSelections_PlayerInstanceId",
                table: "ClubLineupSelections",
                column: "PlayerInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubPresidents_Name",
                table: "ClubPresidents",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubPresidents_UserId",
                table: "ClubPresidents",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_DisplayName",
                table: "Clubs",
                column: "DisplayName");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_DivisionId",
                table: "Clubs",
                column: "DivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_DivisionId_DisplayName",
                table: "Clubs",
                columns: new[] { "DivisionId", "DisplayName" });

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_LifecycleStatus",
                table: "Clubs",
                column: "LifecycleStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_Name",
                table: "Clubs",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_PlacementTargetTier",
                table: "Clubs",
                column: "PlacementTargetTier");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_PresidentId",
                table: "Clubs",
                column: "PresidentId",
                unique: true,
                filter: "[PresidentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_TutorialDivisionId",
                table: "Clubs",
                column: "TutorialDivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_LeagueDivisions_IsTutorial",
                table: "LeagueDivisions",
                column: "IsTutorial");

            migrationBuilder.CreateIndex(
                name: "IX_LeagueDivisions_LifecycleStatus",
                table: "LeagueDivisions",
                column: "LifecycleStatus");

            migrationBuilder.CreateIndex(
                name: "IX_LeagueDivisions_Name",
                table: "LeagueDivisions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeagueDivisions_OwnerUserId",
                table: "LeagueDivisions",
                column: "OwnerUserId",
                unique: true,
                filter: "[IsTutorial] = 1 AND [OwnerUserId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_LeagueDivisions_Tier_GroupNumber",
                table: "LeagueDivisions",
                columns: new[] { "Tier", "GroupNumber" },
                unique: true,
                filter: "[IsTutorial] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_AwayClubId",
                table: "Matches",
                column: "AwayClubId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DivisionId_Season_MatchWeek",
                table: "Matches",
                columns: new[] { "DivisionId", "Season", "MatchWeek" });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DivisionId_Season_MatchWeek_HomeClubId_AwayClubId",
                table: "Matches",
                columns: new[] { "DivisionId", "Season", "MatchWeek", "HomeClubId", "AwayClubId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_HomeClubId",
                table: "Matches",
                column: "HomeClubId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_IsPlayed",
                table: "Matches",
                column: "IsPlayed");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_MatchDate",
                table: "Matches",
                column: "MatchDate");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_RefereeId",
                table: "Matches",
                column: "RefereeId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerInstances_BasePlayerId",
                table: "PlayerInstances",
                column: "BasePlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerInstances_ClubId",
                table: "PlayerInstances",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerInstances_ClubId_Position",
                table: "PlayerInstances",
                columns: new[] { "ClubId", "Position" });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerInstances_Position",
                table: "PlayerInstances",
                column: "Position");

            migrationBuilder.CreateIndex(
                name: "IX_Referees_BriberyDifficulty",
                table: "Referees",
                column: "BriberyDifficulty");

            migrationBuilder.CreateIndex(
                name: "IX_Referees_Name",
                table: "Referees",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Referees_PersonalityType",
                table: "Referees",
                column: "PersonalityType");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransferListings_ClubId",
                table: "TransferListings",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferListings_PlayerInstanceId",
                table: "TransferListings",
                column: "PlayerInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferListings_PlayerInstanceId_Status",
                table: "TransferListings",
                columns: new[] { "PlayerInstanceId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_TransferOffers_BuyingClubId",
                table: "TransferOffers",
                column: "BuyingClubId");

            migrationBuilder.CreateIndex(
                name: "IX_TransferOffers_BuyingClubId_Status",
                table: "TransferOffers",
                columns: new[] { "BuyingClubId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_TransferOffers_TransferListingId",
                table: "TransferOffers",
                column: "TransferListingId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaseBotClubs");

            migrationBuilder.DropTable(
                name: "BribeAttempts");

            migrationBuilder.DropTable(
                name: "ClubActions");

            migrationBuilder.DropTable(
                name: "ClubDraftPicks");

            migrationBuilder.DropTable(
                name: "ClubFacilities");

            migrationBuilder.DropTable(
                name: "ClubLineupSelections");

            migrationBuilder.DropTable(
                name: "TransferOffers");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "ClubLineups");

            migrationBuilder.DropTable(
                name: "TransferListings");

            migrationBuilder.DropTable(
                name: "Referees");

            migrationBuilder.DropTable(
                name: "PlayerInstances");

            migrationBuilder.DropTable(
                name: "BasePlayers");

            migrationBuilder.DropTable(
                name: "Clubs");

            migrationBuilder.DropTable(
                name: "ClubPresidents");

            migrationBuilder.DropTable(
                name: "LeagueDivisions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
