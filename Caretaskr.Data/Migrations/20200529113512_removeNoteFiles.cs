using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class removeNoteFiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "NoteFile");

            migrationBuilder.AddColumn<int>(
                "NoteId1",
                "PatientRecordFile",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_PatientRecordFile_NoteId1",
                "PatientRecordFile",
                "NoteId1");

            migrationBuilder.AddForeignKey(
                "FK_PatientRecordFile_Note_NoteId1",
                "PatientRecordFile",
                "NoteId1",
                "Note",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_PatientRecordFile_Note_NoteId1",
                "PatientRecordFile");

            migrationBuilder.DropIndex(
                "IX_PatientRecordFile_NoteId1",
                "PatientRecordFile");

            migrationBuilder.DropColumn(
                "NoteId1",
                "PatientRecordFile");

            migrationBuilder.CreateTable(
                "NoteFile",
                table => new
                {
                    NoteId = table.Column<int>("int", nullable: false),
                    PatientRecordFileId = table.Column<int>("int", nullable: false),
                    CreatedById = table.Column<Guid>("uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>("datetime2", nullable: false),
                    Id = table.Column<int>("int", nullable: false),
                    IsActive = table.Column<bool>("bit", nullable: false),
                    ModifiedById = table.Column<Guid>("uniqueidentifier", nullable: true),
                    ModifiedDate = table.Column<DateTime>("datetime2", nullable: true),
                    PublicId = table.Column<Guid>("uniqueidentifier", nullable: false)
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
        }
    }
}