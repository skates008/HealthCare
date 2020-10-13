using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class user_entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "City",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Occupation",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PostCode",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "State",
                "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "City",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "Occupation",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "PostCode",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "State",
                "AspNetUsers");
        }
    }
}