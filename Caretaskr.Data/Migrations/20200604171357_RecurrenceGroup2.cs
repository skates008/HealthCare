using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class RecurrenceGroup2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastOcurrence",
                table: "AppointmentRecurrenceGroup");

            migrationBuilder.AddColumn<DateTime>(
                name: "FirstInstance",
                table: "AppointmentRecurrenceGroup",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastInstance",
                table: "AppointmentRecurrenceGroup",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "AppointmentRecurrenceInstance",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecurrenceGroupId = table.Column<int>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    AppointmentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentRecurrenceInstance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentRecurrenceInstance_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentRecurrenceInstance_AppointmentRecurrenceGroup_RecurrenceGroupId",
                        column: x => x.RecurrenceGroupId,
                        principalTable: "AppointmentRecurrenceGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRecurrenceInstance_AppointmentId",
                table: "AppointmentRecurrenceInstance",
                column: "AppointmentId",
                unique: true,
                filter: "[AppointmentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRecurrenceInstance_RecurrenceGroupId",
                table: "AppointmentRecurrenceInstance",
                column: "RecurrenceGroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentRecurrenceInstance");

            migrationBuilder.DropColumn(
                name: "FirstInstance",
                table: "AppointmentRecurrenceGroup");

            migrationBuilder.DropColumn(
                name: "LastInstance",
                table: "AppointmentRecurrenceGroup");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastOcurrence",
                table: "AppointmentRecurrenceGroup",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
