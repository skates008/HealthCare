using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appntNotes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "ExternalNote",
                "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "InternalNote",
                "Appointments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "ExternalNote",
                "Appointments");

            migrationBuilder.DropColumn(
                "InternalNote",
                "Appointments");
        }
    }
}