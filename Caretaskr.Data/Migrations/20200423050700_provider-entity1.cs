using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class providerentity1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "PrimaryContactName",
                "Providers");

            migrationBuilder.AddColumn<string>(
                "PrimaryContactFirstName",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PrimaryContactLastName",
                "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "PrimaryContactFirstName",
                "Providers");

            migrationBuilder.DropColumn(
                "PrimaryContactLastName",
                "Providers");

            migrationBuilder.AddColumn<string>(
                "PrimaryContactName",
                "Providers",
                "nvarchar(max)",
                nullable: true);
        }
    }
}