using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class carer_remove : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "CarerPatients");

            migrationBuilder.DropTable(
                "Carers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}