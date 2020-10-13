using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientRecordtoPatientNote : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_PatientNotes_Patients_PatientId",
                "PatientNotes");

            migrationBuilder.DropIndex(
                "IX_PatientNotes_PatientId",
                "PatientNotes");

            migrationBuilder.DropColumn(
                "PatientId",
                "PatientNotes");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "PatientNotes",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_PatientNotes_PatientRecordId",
                "PatientNotes",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_PatientNotes_PatientRecord_PatientRecordId",
                "PatientNotes",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_PatientNotes_PatientRecord_PatientRecordId",
                "PatientNotes");

            migrationBuilder.DropIndex(
                "IX_PatientNotes_PatientRecordId",
                "PatientNotes");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "PatientNotes");

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "PatientNotes",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_PatientNotes_PatientId",
                "PatientNotes",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_PatientNotes_Patients_PatientId",
                "PatientNotes",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}