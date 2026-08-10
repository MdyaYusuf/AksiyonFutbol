using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AksiyonFutbol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClubActionTargetPlayer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TargetPlayerInstanceId",
                table: "ClubActions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_ClubId_TargetPlayerInstanceId_ActionType",
                table: "ClubActions",
                columns: new[] { "ClubId", "TargetPlayerInstanceId", "ActionType" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubActions_TargetPlayerInstanceId",
                table: "ClubActions",
                column: "TargetPlayerInstanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClubActions_PlayerInstances_TargetPlayerInstanceId",
                table: "ClubActions",
                column: "TargetPlayerInstanceId",
                principalTable: "PlayerInstances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClubActions_PlayerInstances_TargetPlayerInstanceId",
                table: "ClubActions");

            migrationBuilder.DropIndex(
                name: "IX_ClubActions_ClubId_TargetPlayerInstanceId_ActionType",
                table: "ClubActions");

            migrationBuilder.DropIndex(
                name: "IX_ClubActions_TargetPlayerInstanceId",
                table: "ClubActions");

            migrationBuilder.DropColumn(
                name: "TargetPlayerInstanceId",
                table: "ClubActions");
        }
    }
}
