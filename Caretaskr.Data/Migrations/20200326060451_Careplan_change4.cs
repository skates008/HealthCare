using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Careplan_change4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_MyGoals_Careplans_CareplanId",
                "MyGoals");

            migrationBuilder.RenameColumn(
                "CareplanId",
                "MyGoals",
                "CarePlanId");

            migrationBuilder.RenameIndex(
                "IX_MyGoals_CareplanId",
                table: "MyGoals",
                newName: "IX_MyGoals_CarePlanId");

            migrationBuilder.AlterColumn<int>(
                "CarePlanId",
                "MyGoals",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_Careplans_CarePlanId",
                "MyGoals",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_MyGoals_Careplans_CarePlanId",
                "MyGoals");

            migrationBuilder.RenameColumn(
                "CarePlanId",
                "MyGoals",
                "CareplanId");

            migrationBuilder.RenameIndex(
                "IX_MyGoals_CarePlanId",
                table: "MyGoals",
                newName: "IX_MyGoals_CareplanId");

            migrationBuilder.AlterColumn<int>(
                "CareplanId",
                "MyGoals",
                "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_Careplans_CareplanId",
                "MyGoals",
                "CareplanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}