using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appointmententity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "AppointmentType",
                "Appointments");

            migrationBuilder.AddColumn<string>(
                "Location",
                "Appointments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "Location",
                "Appointments");

            migrationBuilder.AddColumn<int>(
                "AppointmentType",
                "Appointments",
                "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}