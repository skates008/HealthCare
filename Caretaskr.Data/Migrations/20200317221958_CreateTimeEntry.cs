using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class CreateTimeEntry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "TimeEntry",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    BillableItemId = table.Column<int>(nullable: false),
                    Starttime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    DurationInMinutes = table.Column<int>(nullable: false),
                    TravelTimeInMinutes = table.Column<int>(nullable: false),
                    AppointmentId = table.Column<Guid>(nullable: false),
                    AppointmentId1 = table.Column<int>(nullable: true),
                    CarePlanId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeEntry", x => x.Id);
                    table.ForeignKey(
                        "FK_TimeEntry_Appointments_AppointmentId1",
                        x => x.AppointmentId1,
                        "Appointments",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_TimeEntry_BillableItem_BillableItemId",
                        x => x.BillableItemId,
                        "BillableItem",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_TimeEntry_Careplans_CarePlanId",
                        x => x.CarePlanId,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_TimeEntry_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_TimeEntry_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "TimeEntryUser",
                table => new
                {
                    TimeEntryId = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeEntryUser", x => new {x.UserId, x.TimeEntryId});
                    table.ForeignKey(
                        "FK_TimeEntryUser_TimeEntry_TimeEntryId",
                        x => x.TimeEntryId,
                        "TimeEntry",
                        "Id");
                    table.ForeignKey(
                        "FK_TimeEntryUser_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_AppointmentId1",
                "TimeEntry",
                "AppointmentId1");

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_BillableItemId",
                "TimeEntry",
                "BillableItemId");

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_CarePlanId",
                "TimeEntry",
                "CarePlanId");

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_CreatedById",
                "TimeEntry",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_ModifiedById",
                "TimeEntry",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_TimeEntryUser_TimeEntryId",
                "TimeEntryUser",
                "TimeEntryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "TimeEntryUser");

            migrationBuilder.DropTable(
                "TimeEntry");
        }
    }
}