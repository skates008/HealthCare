using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class providercompanytype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "MyProperty",
                "Providers");

            migrationBuilder.AddColumn<string>(
                "CompanyType",
                "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "CompanyType",
                "Providers");

            migrationBuilder.AddColumn<string>(
                "MyProperty",
                "Providers",
                "nvarchar(max)",
                nullable: true);
        }
    }
}