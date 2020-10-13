using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Entity_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "IsRegistrationComplete",
                "Patients");

            migrationBuilder.AddColumn<bool>(
                "IsRegistrationComplete",
                "AspNetUsers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "IsRegistrationComplete",
                "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                "IsRegistrationComplete",
                "Patients",
                "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}