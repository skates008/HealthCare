using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Carer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                "HasCarer",
                "Patients",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                "IsRegistrationComplete",
                "Patients",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "HasCarer",
                "Patients");

            migrationBuilder.DropColumn(
                "IsRegistrationComplete",
                "Patients");
        }
    }
}