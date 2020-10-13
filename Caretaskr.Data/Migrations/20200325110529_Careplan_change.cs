using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Careplan_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Careplans_PatientId",
                "Careplans",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_Careplans_Patients_PatientId",
                "Careplans",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Careplans_Patients_PatientId",
                "Careplans");

            migrationBuilder.DropIndex(
                "IX_Careplans_PatientId",
                "Careplans");

            migrationBuilder.DropColumn(
                "PatientId",
                "Careplans");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Careplans",
                "int",
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
    }
}