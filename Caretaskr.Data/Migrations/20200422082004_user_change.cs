using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class user_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                "CreatedById",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "FirstName",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "LastName",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "ModifiedById",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_AspNetUsers_CreatedById",
                "AspNetUsers",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_AspNetUsers_ModifiedById",
                "AspNetUsers",
                "ModifiedById");

            migrationBuilder.AddForeignKey(
                "FK_AspNetUsers_AspNetUsers_CreatedById",
                "AspNetUsers",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_AspNetUsers_AspNetUsers_ModifiedById",
                "AspNetUsers",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_AspNetUsers_AspNetUsers_CreatedById",
                "AspNetUsers");

            migrationBuilder.DropForeignKey(
                "FK_AspNetUsers_AspNetUsers_ModifiedById",
                "AspNetUsers");

            migrationBuilder.DropIndex(
                "IX_AspNetUsers_CreatedById",
                "AspNetUsers");

            migrationBuilder.DropIndex(
                "IX_AspNetUsers_ModifiedById",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "CreatedById",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "FirstName",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "LastName",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "ModifiedById",
                "AspNetUsers");
        }
    }
}