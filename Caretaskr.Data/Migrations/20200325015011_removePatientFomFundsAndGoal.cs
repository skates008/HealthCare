using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class removePatientFomFundsAndGoal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_Patients_PatientId",
                "FundedSupports");

            migrationBuilder.DropForeignKey(
                "FK_MyGoals_Patients_PatientId",
                "MyGoals");

            migrationBuilder.DropIndex(
                "IX_MyGoals_PatientId",
                "MyGoals");

            migrationBuilder.DropIndex(
                "IX_FundedSupports_PatientId",
                "FundedSupports");

            migrationBuilder.DropColumn(
                "PatientId",
                "MyGoals");

            migrationBuilder.DropColumn(
                "PatientId",
                "FundedSupports");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "MyGoals",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "FundedSupports",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_MyGoals_PatientId",
                "MyGoals",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_PatientId",
                "FundedSupports",
                "PatientId");

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_Patients_PatientId",
                "FundedSupports",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_Patients_PatientId",
                "MyGoals",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}