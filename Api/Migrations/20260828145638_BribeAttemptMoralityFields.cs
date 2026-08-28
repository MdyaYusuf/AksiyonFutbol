using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class BribeAttemptMoralityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DetectionChance",
                table: "BribeAttempts",
                type: "decimal(5,4)",
                precision: 5,
                scale: 4,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "FineAmount",
                table: "BribeAttempts",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "HeatGenerated",
                table: "BribeAttempts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScandalMoralePenaltyApplied",
                table: "BribeAttempts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScandalReputationPenaltyApplied",
                table: "BribeAttempts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "WasDetected",
                table: "BribeAttempts",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DetectionChance",
                table: "BribeAttempts");

            migrationBuilder.DropColumn(
                name: "FineAmount",
                table: "BribeAttempts");

            migrationBuilder.DropColumn(
                name: "HeatGenerated",
                table: "BribeAttempts");

            migrationBuilder.DropColumn(
                name: "ScandalMoralePenaltyApplied",
                table: "BribeAttempts");

            migrationBuilder.DropColumn(
                name: "ScandalReputationPenaltyApplied",
                table: "BribeAttempts");

            migrationBuilder.DropColumn(
                name: "WasDetected",
                table: "BribeAttempts");
        }
    }
}
