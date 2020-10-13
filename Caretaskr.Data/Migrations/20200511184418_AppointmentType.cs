using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AppointmentType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "AppointmentTypeId",
                "Appointments",
                nullable: true);

            migrationBuilder.CreateTable(
                "AppointmentType",
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
                    ProviderId = table.Column<int>(nullable: false),
                    IsBillable = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentType", x => x.Id);
                    table.ForeignKey(
                        "FK_AppointmentType_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_AppointmentType_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_AppointmentType_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_Appointments_AppointmentTypeId",
                "Appointments",
                "AppointmentTypeId");

            migrationBuilder.CreateIndex(
                "IX_AppointmentType_CreatedById",
                "AppointmentType",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_AppointmentType_ModifiedById",
                "AppointmentType",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_AppointmentType_ProviderId",
                "AppointmentType",
                "ProviderId");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_AppointmentType_AppointmentTypeId",
                "Appointments",
                "AppointmentTypeId",
                "AppointmentType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_AppointmentType_AppointmentTypeId",
                "Appointments");

            migrationBuilder.DropTable(
                "AppointmentType");

            migrationBuilder.DropIndex(
                "IX_Appointments_AppointmentTypeId",
                "Appointments");

            migrationBuilder.DropColumn(
                "AppointmentTypeId",
                "Appointments");
        }
    }
}