using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class fileuploads : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FileUpload_FileUpload_PatientRecordFileId",
                "FileUpload");

            migrationBuilder.DropIndex(
                "IX_FileUpload_PatientRecordFileId",
                "FileUpload");

            migrationBuilder.DropColumn(
                "PatientRecordFileId",
                "FileUpload");

            migrationBuilder.AddColumn<int>(
                "FileUploadId1",
                "PatientRecordFile",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_FileUploadId1",
                "PatientRecordFile",
                "FileUploadId1",
                unique: true,
                filter: "[FileUploadId1] IS NOT NULL");

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
                "FK_PatientRecordFile_FileUpload_FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.AddColumn<int>(
                "PatientRecordFileId",
                "FileUpload",
                "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_FileUpload_PatientRecordFileId",
                "FileUpload",
                "PatientRecordFileId");

            migrationBuilder.AddForeignKey(
                "FK_FileUpload_FileUpload_PatientRecordFileId",
                "FileUpload",
                "PatientRecordFileId",
                "FileUpload",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}