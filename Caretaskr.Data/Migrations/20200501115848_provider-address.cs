using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class provideraddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "City",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PostCode",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "State",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetName",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Unit",
                "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "City",
                "Providers");

            migrationBuilder.DropColumn(
                "PostCode",
                "Providers");

            migrationBuilder.DropColumn(
                "State",
                "Providers");

            migrationBuilder.DropColumn(
                "StreetName",
                "Providers");

            migrationBuilder.DropColumn(
                "StreetNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "Unit",
                "Providers");
        }
    }
}