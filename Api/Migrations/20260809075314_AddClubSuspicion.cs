using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClubSuspicion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Suspicion",
                table: "Clubs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Suspicion",
                table: "Clubs");
        }
    }
}
