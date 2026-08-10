using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClubActionInvestigationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "FineAmount",
                table: "ClubActions",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "MatchPenaltyApplied",
                table: "ClubActions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ScandalMoralePenaltyApplied",
                table: "ClubActions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScandalReputationPenaltyApplied",
                table: "ClubActions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FineAmount",
                table: "ClubActions");

            migrationBuilder.DropColumn(
                name: "MatchPenaltyApplied",
                table: "ClubActions");

            migrationBuilder.DropColumn(
                name: "ScandalMoralePenaltyApplied",
                table: "ClubActions");

            migrationBuilder.DropColumn(
                name: "ScandalReputationPenaltyApplied",
                table: "ClubActions");
        }
    }
}
