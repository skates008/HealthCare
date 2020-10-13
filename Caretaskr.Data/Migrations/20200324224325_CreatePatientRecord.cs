using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class CreatePatientRecord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_AppointmentNotes_Patients_PatientId",
                "AppointmentNotes");

            migrationBuilder.DropForeignKey(
                "FK_Appointments_Patients_PatientId",
                "Appointments");

            migrationBuilder.DropForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients");

            migrationBuilder.DropIndex(
                "IX_Patients_providerId",
                "Patients");

            migrationBuilder.DropIndex(
                "IX_Appointments_PatientId",
                "Appointments");

            migrationBuilder.DropIndex(
                "IX_AppointmentNotes_PatientId",
                "AppointmentNotes");

            migrationBuilder.DropColumn(
                "providerId",
                "Patients");

            migrationBuilder.DropColumn(
                "PatientId",
                "Appointments");

            migrationBuilder.DropColumn(
                "PatientId",
                "AppointmentNotes");

            migrationBuilder.AddColumn<int>(
                "ProviderId",
                "BillableItem",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Appointments",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                "PatientRecord",
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
                    PatientId = table.Column<Guid>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRecord", x => x.Id);
                    table.ForeignKey(
                        "FK_PatientRecord_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PatientRecord_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PatientRecord_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id");
                    table.ForeignKey(
                        "FK_PatientRecord_Provider_ProviderId",
                        x => x.ProviderId,
                        "Provider",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_BillableItem_ProviderId",
                "BillableItem",
                "ProviderId");

            migrationBuilder.CreateIndex(
                "IX_Appointments_PatientRecordId",
                "Appointments",
                "PatientRecordId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecord_CreatedById",
                "PatientRecord",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_PatientRecord_ModifiedById",
                "PatientRecord",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_PatientRecord_PatientId",
                "PatientRecord",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecord_ProviderId",
                "PatientRecord",
                "ProviderId");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_PatientRecord_PatientRecordId",
                "Appointments",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_BillableItem_Provider_ProviderId",
                "BillableItem",
                "ProviderId",
                "Provider",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_PatientRecord_PatientRecordId",
                "Appointments");

            migrationBuilder.DropForeignKey(
                "FK_BillableItem_Provider_ProviderId",
                "BillableItem");

            migrationBuilder.DropTable(
                "PatientRecord");

            migrationBuilder.DropIndex(
                "IX_BillableItem_ProviderId",
                "BillableItem");

            migrationBuilder.DropIndex(
                "IX_Appointments_PatientRecordId",
                "Appointments");

            migrationBuilder.DropColumn(
                "ProviderId",
                "BillableItem");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "Appointments");

            migrationBuilder.AddColumn<int>(
                "providerId",
                "Patients",
                "int",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "Appointments",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "AppointmentNotes",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Patients_providerId",
                "Patients",
                "providerId");

            migrationBuilder.CreateIndex(
                "IX_Appointments_PatientId",
                "Appointments",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_AppointmentNotes_PatientId",
                "AppointmentNotes",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_AppointmentNotes_Patients_PatientId",
                "AppointmentNotes",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Appointments_Patients_PatientId",
                "Appointments",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients",
                "providerId",
                "Provider",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}