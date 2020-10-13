using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class TimeEntryAppointmentIdFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId1",
                "TimeEntry");

            migrationBuilder.DropIndex(
                "IX_TimeEntry_AppointmentId1",
                "TimeEntry");

            migrationBuilder.DropColumn(
                "AppointmentId",
                "TimeEntry");

            migrationBuilder.DropColumn(
                "AppointmentId1",
                "TimeEntry");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                "AppointmentId",
                "TimeEntry",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                "AppointmentId1",
                "TimeEntry",
                "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_AppointmentId1",
                "TimeEntry",
                "AppointmentId1");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_Appointments_AppointmentId1",
                "TimeEntry",
                "AppointmentId1",
                "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}