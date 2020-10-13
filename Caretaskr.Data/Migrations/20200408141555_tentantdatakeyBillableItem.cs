using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class tentantdatakeyBillableItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "TenantKey",
                "BillableItem");

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "BillableItem",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "TenantDataKey",
                "BillableItem");

            migrationBuilder.AddColumn<string>(
                "TenantKey",
                "BillableItem",
                "nvarchar(max)",
                nullable: true);
        }
    }
}