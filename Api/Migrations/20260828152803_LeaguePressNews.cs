using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class LeaguePressNews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NewsArticles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DivisionId = table.Column<int>(type: "int", nullable: false),
                    Season = table.Column<int>(type: "int", nullable: false),
                    MatchWeek = table.Column<int>(type: "int", nullable: true),
                    SubjectClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Kind = table.Column<int>(type: "int", nullable: false),
                    Tone = table.Column<int>(type: "int", nullable: false),
                    Headline = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Body = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    SourceMatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SourceClubActionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SourceBribeAttemptId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsArticles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NewsArticles_Clubs_SubjectClubId",
                        column: x => x.SubjectClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_DivisionId",
                table: "NewsArticles",
                column: "DivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_DivisionId_CreatedDate",
                table: "NewsArticles",
                columns: new[] { "DivisionId", "CreatedDate" });

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_SourceBribeAttemptId",
                table: "NewsArticles",
                column: "SourceBribeAttemptId",
                unique: true,
                filter: "[SourceBribeAttemptId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_SourceClubActionId",
                table: "NewsArticles",
                column: "SourceClubActionId",
                unique: true,
                filter: "[SourceClubActionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_SourceMatchId",
                table: "NewsArticles",
                column: "SourceMatchId",
                unique: true,
                filter: "[SourceMatchId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_SubjectClubId",
                table: "NewsArticles",
                column: "SubjectClubId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NewsArticles");
        }
    }
}
