using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Assesment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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
                nullable: true);

            migrationBuilder.CreateTable(
                "Assesment",
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
                    PatientRecordFileId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    AssessmentDate = table.Column<DateTime>(nullable: false),
                    ValidFromDate = table.Column<DateTime>(nullable: false),
                    ValidToDate = table.Column<DateTime>(nullable: false),
                    Assessor = table.Column<string>(nullable: true),
                    TenantDataKey = table.Column<string>(nullable: true),
                    PatientDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assesment", x => x.Id);
                    table.ForeignKey(
                        "FK_Assesment_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Assesment_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Assesment_PatientRecordFile_PatientRecordFileId",
                        x => x.PatientRecordFileId,
                        "PatientRecordFile",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Assesment_PatientRecord_PatientRecordId",
                        x => x.PatientRecordId,
                        "PatientRecord",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_FileUpload_PatientRecordFileId",
                "FileUpload",
                "PatientRecordFileId");

            migrationBuilder.CreateIndex(
                "IX_Assesment_CreatedById",
                "Assesment",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Assesment_ModifiedById",
                "Assesment",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Assesment_PatientRecordFileId",
                "Assesment",
                "PatientRecordFileId");

            migrationBuilder.CreateIndex(
                "IX_Assesment_PatientRecordId",
                "Assesment",
                "PatientRecordId");

            migrationBuilder.AddForeignKey(
                "FK_FileUpload_FileUpload_PatientRecordFileId",
                "FileUpload",
                "PatientRecordFileId",
                "FileUpload",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FileUpload_FileUpload_PatientRecordFileId",
                "FileUpload");

            migrationBuilder.DropTable(
                "Assesment");

            migrationBuilder.DropIndex(
                "IX_FileUpload_PatientRecordFileId",
                "FileUpload");

            migrationBuilder.DropColumn(
                "PatientRecordFileId",
                "FileUpload");

            migrationBuilder.AddColumn<int>(
                "FileUploadId1",
                "PatientRecordFile",
                "int",
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
    }
}