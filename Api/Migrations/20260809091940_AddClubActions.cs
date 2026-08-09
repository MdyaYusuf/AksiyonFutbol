using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClubActions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                });

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
                name: "IX_ClubActions_MatchId",
                table: "ClubActions",
                column: "MatchId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClubActions");
        }
    }
}
