using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class PresidentAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Authority",
                table: "ClubPresidents",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "Charisma",
                table: "ClubPresidents",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "Connections",
                table: "ClubPresidents",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "Cunning",
                table: "ClubPresidents",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "Integrity",
                table: "ClubPresidents",
                type: "int",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Authority",
                table: "ClubPresidents");

            migrationBuilder.DropColumn(
                name: "Charisma",
                table: "ClubPresidents");

            migrationBuilder.DropColumn(
                name: "Connections",
                table: "ClubPresidents");

            migrationBuilder.DropColumn(
                name: "Cunning",
                table: "ClubPresidents");

            migrationBuilder.DropColumn(
                name: "Integrity",
                table: "ClubPresidents");
        }
    }
}
