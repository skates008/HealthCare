using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class fileuploads2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_PatientRecordFile_FileUpload_FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_FileUploadId",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "FileUploadId1",
                "PatientRecordFile");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_FileUploadId",
                "PatientRecordFile",
                "FileUploadId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_FileUploadId",
                "PatientRecordFile");

            migrationBuilder.AddColumn<int>(
                "FileUploadId1",
                "PatientRecordFile",
                "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_FileUploadId",
                "PatientRecordFile",
                "FileUploadId");

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
    }
}