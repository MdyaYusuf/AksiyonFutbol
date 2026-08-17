using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSeasonStamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Matches_DivisionId_MatchWeek",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_DivisionId_MatchWeek_HomeClubId_AwayClubId",
                table: "Matches");

            migrationBuilder.AddColumn<int>(
                name: "Season",
                table: "Matches",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "CurrentSeason",
                table: "LeagueDivisions",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DivisionId_Season_MatchWeek",
                table: "Matches",
                columns: new[] { "DivisionId", "Season", "MatchWeek" });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DivisionId_Season_MatchWeek_HomeClubId_AwayClubId",
                table: "Matches",
                columns: new[] { "DivisionId", "Season", "MatchWeek", "HomeClubId", "AwayClubId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Matches_DivisionId_Season_MatchWeek",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_DivisionId_Season_MatchWeek_HomeClubId_AwayClubId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "Season",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "CurrentSeason",
                table: "LeagueDivisions");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DivisionId_MatchWeek",
                table: "Matches",
                columns: new[] { "DivisionId", "MatchWeek" });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DivisionId_MatchWeek_HomeClubId_AwayClubId",
                table: "Matches",
                columns: new[] { "DivisionId", "MatchWeek", "HomeClubId", "AwayClubId" },
                unique: true);
        }
    }
}
