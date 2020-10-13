using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Careplan_change3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_Careplans_CarePlanId",
                "FundedSupports");

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
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_Careplans_CarePlanId",
                "FundedSupports",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_Careplans_CareplanId",
                "MyGoals",
                "CareplanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_Careplans_CarePlanId",
                "FundedSupports");

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
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_Careplans_CarePlanId",
                "FundedSupports",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_Careplans_CarePlanId",
                "MyGoals",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}