using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientRecordtoAllergies : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Allergies_Patients_PatientId",
                "Allergies");

            migrationBuilder.DropIndex(
                "IX_Allergies_PatientId",
                "Allergies");

            migrationBuilder.DropColumn(
                "PatientId",
                "Allergies");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Allergies",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_Allergies_PatientRecordId",
                "Allergies",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_Allergies_PatientRecord_PatientRecordId",
                "Allergies",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Allergies_PatientRecord_PatientRecordId",
                "Allergies");

            migrationBuilder.DropIndex(
                "IX_Allergies_PatientRecordId",
                "Allergies");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "Allergies");

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "Allergies",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Allergies_PatientId",
                "Allergies",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_Allergies_Patients_PatientId",
                "Allergies",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}