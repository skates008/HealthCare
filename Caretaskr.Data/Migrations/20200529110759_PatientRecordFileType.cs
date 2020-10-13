using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class PatientRecordFileType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Assesment_PatientRecordFile_PatientRecordFileId",
                "Assesment");

            migrationBuilder.DropForeignKey(
                "FK_ServiceAgreement_PatientRecordFile_PatientRecordFileId",
                "ServiceAgreement");

            migrationBuilder.DropIndex(
                "IX_ServiceAgreement_PatientRecordFileId",
                "ServiceAgreement");

            migrationBuilder.DropIndex(
                "IX_Assesment_PatientRecordFileId",
                "Assesment");


            migrationBuilder.DropColumn(
                "PatientRecordFileId",
                "ServiceAgreement");


            migrationBuilder.DropColumn(
                "PatientRecordFileId",
                "Assesment");


            migrationBuilder.AddColumn<int>(
                "AssesmentId",
                "PatientRecordFile",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "NoteId",
                "PatientRecordFile",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "ServiceAgreementId",
                "PatientRecordFile",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "Type",
                "PatientRecordFile",
                nullable: false,
                defaultValue: 0);


            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_AssesmentId",
                "PatientRecordFile",
                "AssesmentId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_NoteId",
                "PatientRecordFile",
                "NoteId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_ServiceAgreementId",
                "PatientRecordFile",
                "ServiceAgreementId");


            migrationBuilder.AddForeignKey(
                "FK_PatientRecordFile_Assesment_AssesmentId",
                "PatientRecordFile",
                "AssesmentId",
                "Assesment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_PatientRecordFile_Note_NoteId",
                "PatientRecordFile",
                "NoteId",
                "Note",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_PatientRecordFile_ServiceAgreement_ServiceAgreementId",
                "PatientRecordFile",
                "ServiceAgreementId",
                "ServiceAgreement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_AspNetUsers_Address_AddressId",
                "AspNetUsers");

            migrationBuilder.DropForeignKey(
                "FK_PatientRecordFile_Assesment_AssesmentId",
                "PatientRecordFile");

            migrationBuilder.DropForeignKey(
                "FK_PatientRecordFile_Note_NoteId",
                "PatientRecordFile");

            migrationBuilder.DropForeignKey(
                "FK_PatientRecordFile_ServiceAgreement_ServiceAgreementId",
                "PatientRecordFile");

            migrationBuilder.DropForeignKey(
                "FK_Patients_Address_SchoolAddressId",
                "Patients");

            migrationBuilder.DropIndex(
                "IX_Patients_SchoolAddressId",
                "Patients");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_AssesmentId",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_NoteId",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_ServiceAgreementId",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_AspNetUsers_AddressId",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "SchoolAddressId",
                "Patients");

            migrationBuilder.DropColumn(
                "AssesmentId",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "NoteId",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "ServiceAgreementId",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "Type",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "AddressId",
                "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                "PatientRecordFileId",
                "ServiceAgreement",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "SchoolAddress",
                "Patients",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "PatientRecordFileId",
                "Assesment",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "Address",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "City",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                "Latitude",
                "AspNetUsers",
                "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                "Longitude",
                "AspNetUsers",
                "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                "PostCode",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "State",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetName",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetNumber",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Unit",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "CreatedById",
                "Address",
                "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "CreatedDate",
                "Address",
                "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                "ModifiedById",
                "Address",
                "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "ModifiedDate",
                "Address",
                "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "PublicId",
                "Address",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_ServiceAgreement_PatientRecordFileId",
                "ServiceAgreement",
                "PatientRecordFileId");

            migrationBuilder.CreateIndex(
                "IX_Assesment_PatientRecordFileId",
                "Assesment",
                "PatientRecordFileId");

            migrationBuilder.CreateIndex(
                "IX_Address_CreatedById",
                "Address",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Address_ModifiedById",
                "Address",
                "ModifiedById");

            migrationBuilder.AddForeignKey(
                "FK_Address_AspNetUsers_CreatedById",
                "Address",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Address_AspNetUsers_ModifiedById",
                "Address",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Assesment_PatientRecordFile_PatientRecordFileId",
                "Assesment",
                "PatientRecordFileId",
                "PatientRecordFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_ServiceAgreement_PatientRecordFile_PatientRecordFileId",
                "ServiceAgreement",
                "PatientRecordFileId",
                "PatientRecordFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}