using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class invoicefileupload : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FileId",
                table: "Invoice",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_FileId",
                table: "Invoice",
                column: "FileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoice_PatientRecordFile_FileId",
                table: "Invoice",
                column: "FileId",
                principalTable: "PatientRecordFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoice_PatientRecordFile_FileId",
                table: "Invoice");

            migrationBuilder.DropIndex(
                name: "IX_Invoice_FileId",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "Invoice");
        }
    }
}
