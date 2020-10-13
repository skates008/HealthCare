using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class shorttermgoalentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                "Outcome",
                "CareplanShortTermGoal",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                "Outcome",
                "CareplanShortTermGoal",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}