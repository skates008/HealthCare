using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class providerentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "PrimaryContactNo",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PrimaryContactPosition",
                "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "PrimaryContactNo",
                "Providers");

            migrationBuilder.DropColumn(
                "PrimaryContactPosition",
                "Providers");
        }
    }
}