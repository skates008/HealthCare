using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class FileUploadSize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                "Size",
                "FileUpload",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "Size",
                "FileUpload");
        }
    }
}