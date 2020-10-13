using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class patientRecordBillingDetailsFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_PatientRecord_PatientRecordId",
                "BillingDetails");

            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_PatientRecord_PatientRecordId1",
                "BillingDetails");

            migrationBuilder.DropIndex(
                "IX_BillingDetails_PatientRecordId",
                "BillingDetails");

            migrationBuilder.DropIndex(
                "IX_BillingDetails_PatientRecordId1",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "PatientRecordId1",
                "BillingDetails");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_PatientRecordId",
                "BillingDetails",
                "PatientRecordId",
                unique: true);

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_PatientRecord_PatientRecordId",
                "BillingDetails",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_PatientRecord_PatientRecordId",
                "BillingDetails");

            migrationBuilder.DropIndex(
                "IX_BillingDetails_PatientRecordId",
                "BillingDetails");

            migrationBuilder.AddColumn<int>(
                "PatientRecordId1",
                "BillingDetails",
                "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_PatientRecordId",
                "BillingDetails",
                "PatientRecordId");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_PatientRecordId1",
                "BillingDetails",
                "PatientRecordId1",
                unique: true,
                filter: "[PatientRecordId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_PatientRecord_PatientRecordId",
                "BillingDetails",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_PatientRecord_PatientRecordId1",
                "BillingDetails",
                "PatientRecordId1",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}