using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "FullDay",
                "TimeEntry");

            migrationBuilder.DropColumn(
                "TravelTimeInMinutes",
                "TimeEntry");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                "FullDay",
                "TimeEntry",
                "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                "TravelTimeInMinutes",
                "TimeEntry",
                "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}