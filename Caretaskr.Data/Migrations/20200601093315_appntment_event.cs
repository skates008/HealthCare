using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appntment_event : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppointmentEventGroupId",
                table: "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "Appointments",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentEventGroup",
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
                    StartDate = table.Column<DateTime>(nullable: true),
                    EndDate = table.Column<DateTime>(nullable: true),
                    DayOfWeek = table.Column<string>(nullable: true),
                    Frequency = table.Column<int>(nullable: false)
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

        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
