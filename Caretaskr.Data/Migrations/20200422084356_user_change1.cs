using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class user_change1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                "CreatedDate",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "ModifiedDate",
                "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "CreatedDate",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "ModifiedDate",
                "AspNetUsers");
        }
    }
}