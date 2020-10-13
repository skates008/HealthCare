using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientRecordtoMedication : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Medications_Patients_PatientId",
                "Medications");

            migrationBuilder.DropIndex(
                "IX_Medications_PatientId",
                "Medications");

            migrationBuilder.DropColumn(
                "PatientId",
                "Medications");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Medications",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_Medications_PatientRecordId",
                "Medications",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_Medications_PatientRecord_PatientRecordId",
                "Medications",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Medications_PatientRecord_PatientRecordId",
                "Medications");

            migrationBuilder.DropIndex(
                "IX_Medications_PatientRecordId",
                "Medications");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "Medications");

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "Medications",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Medications_PatientId",
                "Medications",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_Medications_Patients_PatientId",
                "Medications",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}