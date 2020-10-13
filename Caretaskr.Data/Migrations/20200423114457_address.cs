using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class address : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "StreetName",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetNumber",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Unit",
                "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "StreetName",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "StreetNumber",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "Unit",
                "AspNetUsers");
        }
    }
}