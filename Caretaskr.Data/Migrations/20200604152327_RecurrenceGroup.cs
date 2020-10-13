using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class RecurrenceGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_AppointmentEventGroup_AppointmentEventGroupId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "AppointmentEventGroup");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_AppointmentEventGroupId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "AppointmentEventGroupId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "Appointments");

            migrationBuilder.AddColumn<bool>(
                name: "IsRecurrenceException",
                table: "Appointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRecurring",
                table: "Appointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceGroupId",
                table: "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RecurrenceIndex",
                table: "Appointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "AppointmentRecurrenceGroup",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    Rrule = table.Column<string>(nullable: true),
                    LastOcurrence = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentRecurrenceGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentRecurrenceGroup_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentRecurrenceGroup_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });


            migrationBuilder.CreateIndex(
                name: "IX_Appointments_RecurrenceGroupId",
                table: "Appointments",
                column: "RecurrenceGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRecurrenceGroup_CreatedById",
                table: "AppointmentRecurrenceGroup",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRecurrenceGroup_ModifiedById",
                table: "AppointmentRecurrenceGroup",
                column: "ModifiedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_AppointmentRecurrenceGroup_RecurrenceGroupId",
                table: "Appointments",
                column: "RecurrenceGroupId",
                principalTable: "AppointmentRecurrenceGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_AppointmentRecurrenceGroup_RecurrenceGroupId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "AppointmentRecurrenceGroup");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_ExternalNoteId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_ModifiedById",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_RecurrenceGroupId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IsRecurrenceException",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IsRecurring",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "RecurrenceGroupId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "RecurrenceIndex",
                table: "Appointments");

            migrationBuilder.AddColumn<int>(
                name: "AppointmentEventGroupId",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentEventGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DayOfWeek = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Frequency = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ModifiedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentEventGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentEventGroup_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentEventGroup_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_AppointmentEventGroupId",
                table: "Appointments",
                column: "AppointmentEventGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentEventGroup_CreatedById",
                table: "AppointmentEventGroup",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentEventGroup_ModifiedById",
                table: "AppointmentEventGroup",
                column: "ModifiedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_AppointmentEventGroup_AppointmentEventGroupId",
                table: "Appointments",
                column: "AppointmentEventGroupId",
                principalTable: "AppointmentEventGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
