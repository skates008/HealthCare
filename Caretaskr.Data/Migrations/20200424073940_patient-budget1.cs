using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class patientbudget1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Budgets_Patients_PatientId",
                "Budgets");

            migrationBuilder.DropForeignKey(
                "FK_Budgets_Patients_PatientId1",
                "Budgets");

            migrationBuilder.DropIndex(
                "IX_Budgets_PatientId1",
                "Budgets");

            migrationBuilder.DropColumn(
                "PatientId1",
                "Budgets");

            migrationBuilder.AddForeignKey(
                "FK_Budgets_Patients_PatientId",
                "Budgets",
                "PatientId",
                "Patients",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Budgets_Patients_PatientId",
                "Budgets");

            migrationBuilder.AddColumn<Guid>(
                "PatientId1",
                "Budgets",
                "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_Budgets_PatientId1",
                "Budgets",
                "PatientId1");

            migrationBuilder.AddForeignKey(
                "FK_Budgets_Patients_PatientId",
                "Budgets",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Budgets_Patients_PatientId1",
                "Budgets",
                "PatientId1",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}