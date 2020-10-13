using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class TimeEntryAppointmentIdFix2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "AppointmentId",
                "TimeEntry",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_AppointmentId",
                "TimeEntry",
                "AppointmentId");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId",
                "TimeEntry",
                "AppointmentId",
                "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId",
                "TimeEntry");

            migrationBuilder.DropIndex(
                "IX_TimeEntry_AppointmentId",
                "TimeEntry");

            migrationBuilder.DropColumn(
                "AppointmentId",
                "TimeEntry");
        }
    }
}