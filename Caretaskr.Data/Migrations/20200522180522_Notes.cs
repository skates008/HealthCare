using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Notes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "FileUpload",
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
                    Title = table.Column<string>(nullable: true),
                    Filename = table.Column<string>(nullable: true),
                    MimeType = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    ThumbnailUrl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileUpload", x => x.Id);
                    table.ForeignKey(
                        "FK_FileUpload_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_FileUpload_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Note",
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
                    CareplanId = table.Column<int>(nullable: true),
                    AppointmentId = table.Column<int>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true),
                    TenantDataKey = table.Column<string>(nullable: true),
                    PatientDataKey = table.Column<string>(nullable: true),
                    FileUploadId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Note", x => x.Id);
                    table.ForeignKey(
                        "FK_Note_Appointments_AppointmentId",
                        x => x.AppointmentId,
                        "Appointments",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Note_Careplans_CareplanId",
                        x => x.CareplanId,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Note_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Note_FileUpload_FileUploadId",
                        x => x.FileUploadId,
                        "FileUpload",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Note_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Note_PatientRecord_PatientRecordId",
                        x => x.PatientRecordId,
                        "PatientRecord",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "NoteFileUpload",
                table => new
                {
                    NoteId = table.Column<int>(nullable: false),
                    FileUploadId = table.Column<int>(nullable: false)
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
                "IX_FileUpload_CreatedById",
                "FileUpload",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_FileUpload_ModifiedById",
                "FileUpload",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Note_AppointmentId",
                "Note",
                "AppointmentId");

            migrationBuilder.CreateIndex(
                "IX_Note_CareplanId",
                "Note",
                "CareplanId");

            migrationBuilder.CreateIndex(
                "IX_Note_CreatedById",
                "Note",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Note_FileUploadId",
                "Note",
                "FileUploadId");

            migrationBuilder.CreateIndex(
                "IX_Note_ModifiedById",
                "Note",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Note_PatientRecordId",
                "Note",
                "PatientRecordId");

            migrationBuilder.CreateIndex(
                "IX_NoteFileUpload_FileUploadId",
                "NoteFileUpload",
                "FileUploadId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "NoteFileUpload");

            migrationBuilder.DropTable(
                "Note");

            migrationBuilder.DropTable(
                "FileUpload");
        }
    }
}