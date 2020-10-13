using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class makeTimeEntryAppointmentOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId",
                "TimeEntry");

            migrationBuilder.AlterColumn<int>(
                "AppointmentId",
                "TimeEntry",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId",
                "TimeEntry",
                "AppointmentId",
                "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId",
                "TimeEntry");

            migrationBuilder.AlterColumn<int>(
                "AppointmentId",
                "TimeEntry",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId",
                "TimeEntry",
                "AppointmentId",
                "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}