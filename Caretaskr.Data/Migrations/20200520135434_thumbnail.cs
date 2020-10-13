using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class thumbnail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "ThumbnailImageName",
                "UserDocument",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "ThumbnailImageName",
                "ProviderDocument",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "ThumbnailImageName",
                "UserDocument");

            migrationBuilder.DropColumn(
                "ThumbnailImageName",
                "ProviderDocument");
        }
    }
}