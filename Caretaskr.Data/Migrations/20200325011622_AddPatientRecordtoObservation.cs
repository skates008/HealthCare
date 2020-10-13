using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientRecordtoObservation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Observation_Patients_PatientId",
                "Observation");

            migrationBuilder.DropIndex(
                "IX_Observation_PatientId",
                "Observation");

            migrationBuilder.DropColumn(
                "PatientId",
                "Observation");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Observation",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_Observation_PatientRecordId",
                "Observation",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_Observation_PatientRecord_PatientRecordId",
                "Observation",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Observation_PatientRecord_PatientRecordId",
                "Observation");

            migrationBuilder.DropIndex(
                "IX_Observation_PatientRecordId",
                "Observation");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "Observation");

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "Observation",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Observation_PatientId",
                "Observation",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_Observation_Patients_PatientId",
                "Observation",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}