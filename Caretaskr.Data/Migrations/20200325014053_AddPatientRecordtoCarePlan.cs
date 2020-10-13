using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientRecordtoCarePlan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_CarePlanNote_Patients_PatientId",
                "CarePlanNote");

            migrationBuilder.DropForeignKey(
                "FK_Careplans_Patients_PatientId",
                "Careplans");

            migrationBuilder.DropIndex(
                "IX_Careplans_PatientId",
                "Careplans");

            migrationBuilder.DropIndex(
                "IX_CarePlanNote_PatientId",
                "CarePlanNote");

            migrationBuilder.DropColumn(
                "PatientId",
                "Careplans");

            migrationBuilder.DropColumn(
                "PatientId",
                "CarePlanNote");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Careplans",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_Careplans_PatientRecordId",
                "Careplans",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_Careplans_PatientRecord_PatientRecordId",
                "Careplans",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Careplans_PatientRecord_PatientRecordId",
                "Careplans");

            migrationBuilder.DropIndex(
                "IX_Careplans_PatientRecordId",
                "Careplans");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "Careplans");

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "Careplans",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "CarePlanNote",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Careplans_PatientId",
                "Careplans",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_CarePlanNote_PatientId",
                "CarePlanNote",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_CarePlanNote_Patients_PatientId",
                "CarePlanNote",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Careplans_Patients_PatientId",
                "Careplans",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}