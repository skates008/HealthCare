using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class billabletime_entry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                "Unit",
                "BillableItem",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                "GSTCode",
                "BillableItem",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                "Unit",
                "BillableItem",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                "GSTCode",
                "BillableItem",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}