using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientRecordtoClinicalImpression : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_ClinicalImpression_Patients_PatientId",
                "ClinicalImpression");

            migrationBuilder.DropIndex(
                "IX_ClinicalImpression_PatientId",
                "ClinicalImpression");

            migrationBuilder.DropColumn(
                "PatientId",
                "ClinicalImpression");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "ClinicalImpression",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_ClinicalImpression_PatientRecordId",
                "ClinicalImpression",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_ClinicalImpression_PatientRecord_PatientRecordId",
                "ClinicalImpression",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_ClinicalImpression_PatientRecord_PatientRecordId",
                "ClinicalImpression");

            migrationBuilder.DropIndex(
                "IX_ClinicalImpression_PatientRecordId",
                "ClinicalImpression");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "ClinicalImpression");

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "ClinicalImpression",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_ClinicalImpression_PatientId",
                "ClinicalImpression",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_ClinicalImpression_Patients_PatientId",
                "ClinicalImpression",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}