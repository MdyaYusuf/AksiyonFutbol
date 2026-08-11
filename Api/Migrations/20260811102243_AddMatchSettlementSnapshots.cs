using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchSettlementSnapshots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AwayCashBefore",
                table: "Matches",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AwayMoraleBefore",
                table: "Matches",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AwaySuspicionBefore",
                table: "Matches",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "HomeCashBefore",
                table: "Matches",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HomeMoraleBefore",
                table: "Matches",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HomeSuspicionBefore",
                table: "Matches",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AwayCashBefore",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "AwayMoraleBefore",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "AwaySuspicionBefore",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "HomeCashBefore",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "HomeMoraleBefore",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "HomeSuspicionBefore",
                table: "Matches");
        }
    }
}
