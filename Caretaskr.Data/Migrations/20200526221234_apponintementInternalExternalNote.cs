using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class apponintementInternalExternalNote : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "ExternalNote",
                "Appointments");

            migrationBuilder.DropColumn(
                "InternalNote",
                "Appointments");

            migrationBuilder.AddColumn<int>(
                "FileUploadId1",
                "PatientRecordFile",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "ExternalNoteId",
                "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "InternalNoteId",
                "Appointments",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_FileUploadId1",
                "PatientRecordFile",
                "FileUploadId1",
                unique: true,
                filter: "[FileUploadId1] IS NOT NULL");

            migrationBuilder.CreateIndex(
                "IX_Appointments_ExternalNoteId",
                "Appointments",
                "ExternalNoteId");

            migrationBuilder.CreateIndex(
                "IX_Appointments_InternalNoteId",
                "Appointments",
                "InternalNoteId");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_Note_ExternalNoteId",
                "Appointments",
                "ExternalNoteId",
                "Note",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Appointments_Note_InternalNoteId",
                "Appointments",
                "InternalNoteId",
                "Note",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_PatientRecordFile_FileUpload_FileUploadId1",
                "PatientRecordFile",
                "FileUploadId1",
                "FileUpload",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_Note_ExternalNoteId",
                "Appointments");

            migrationBuilder.DropForeignKey(
                "FK_Appointments_Note_InternalNoteId",
                "Appointments");

            migrationBuilder.DropForeignKey(
                "FK_PatientRecordFile_FileUpload_FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_Appointments_ExternalNoteId",
                "Appointments");

            migrationBuilder.DropIndex(
                "IX_Appointments_InternalNoteId",
                "Appointments");

            migrationBuilder.DropColumn(
                "FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "ExternalNoteId",
                "Appointments");

            migrationBuilder.DropColumn(
                "InternalNoteId",
                "Appointments");

            migrationBuilder.AddColumn<string>(
                "ExternalNote",
                "Appointments",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "InternalNote",
                "Appointments",
                "nvarchar(max)",
                nullable: true);
        }
    }
}