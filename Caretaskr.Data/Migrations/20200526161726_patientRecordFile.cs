using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class patientRecordFile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "NoteFileUpload");

            migrationBuilder.AddColumn<int>(
                "MyProperty",
                "FileUpload",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                "PatientRecordFile",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    PatientRecordId = table.Column<int>(nullable: false),
                    FileUploadId = table.Column<int>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    PatientDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRecordFile", x => x.Id);
                    table.ForeignKey(
                        "FK_PatientRecordFile_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PatientRecordFile_FileUpload_FileUploadId",
                        x => x.FileUploadId,
                        "FileUpload",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_PatientRecordFile_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PatientRecordFile_PatientRecord_PatientRecordId",
                        x => x.PatientRecordId,
                        "PatientRecord",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "NoteFile",
                table => new
                {
                    NoteId = table.Column<int>(nullable: false),
                    PatientRecordFileId = table.Column<int>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteFile", x => new {x.NoteId, x.PatientRecordFileId});
                    table.ForeignKey(
                        "FK_NoteFile_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_NoteFile_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_NoteFile_Note_NoteId",
                        x => x.NoteId,
                        "Note",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_NoteFile_PatientRecordFile_PatientRecordFileId",
                        x => x.PatientRecordFileId,
                        "PatientRecordFile",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_NoteFile_CreatedById",
                "NoteFile",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_NoteFile_ModifiedById",
                "NoteFile",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_NoteFile_PatientRecordFileId",
                "NoteFile",
                "PatientRecordFileId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_CreatedById",
                "PatientRecordFile",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_FileUploadId",
                "PatientRecordFile",
                "FileUploadId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_ModifiedById",
                "PatientRecordFile",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_PatientRecordId",
                "PatientRecordFile",
                "PatientRecordId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "NoteFile");

            migrationBuilder.DropTable(
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "MyProperty",
                "FileUpload");

            migrationBuilder.CreateTable(
                "NoteFileUpload",
                table => new
                {
                    NoteId = table.Column<int>("int", nullable: false),
                    FileUploadId = table.Column<int>("int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteFileUpload", x => new {x.NoteId, x.FileUploadId});
                    table.ForeignKey(
                        "FK_NoteFileUpload_FileUpload_FileUploadId",
                        x => x.FileUploadId,
                        "FileUpload",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_NoteFileUpload_Note_NoteId",
                        x => x.NoteId,
                        "Note",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_NoteFileUpload_FileUploadId",
                "NoteFileUpload",
                "FileUploadId");
        }
    }
}