using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class PresidentInfamyPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InfamyPoints",
                table: "ClubPresidents",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InfamyPoints",
                table: "ClubPresidents");
        }
    }
}
