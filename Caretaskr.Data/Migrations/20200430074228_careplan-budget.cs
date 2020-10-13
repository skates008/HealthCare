using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class careplanbudget : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_Budgets_BudgetPlanId",
                "FundedSupports");

            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_FundCategorys_FundCategoryId",
                "FundedSupports");

            migrationBuilder.AlterColumn<int>(
                "FundCategoryId",
                "FundedSupports",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                "FundAllocated",
                "FundedSupports",
                "decimal(7,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(7,2)");

            migrationBuilder.AlterColumn<int>(
                "BudgetPlanId",
                "FundedSupports",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_Budgets_BudgetPlanId",
                "FundedSupports",
                "BudgetPlanId",
                "Budgets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_FundCategorys_FundCategoryId",
                "FundedSupports",
                "FundCategoryId",
                "FundCategorys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_Budgets_BudgetPlanId",
                "FundedSupports");

            migrationBuilder.DropForeignKey(
                "FK_FundedSupports_FundCategorys_FundCategoryId",
                "FundedSupports");

            migrationBuilder.AlterColumn<int>(
                "FundCategoryId",
                "FundedSupports",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                "FundAllocated",
                "FundedSupports",
                "decimal(7,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(7,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                "BudgetPlanId",
                "FundedSupports",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_Budgets_BudgetPlanId",
                "FundedSupports",
                "BudgetPlanId",
                "Budgets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_FundedSupports_FundCategorys_FundCategoryId",
                "FundedSupports",
                "FundCategoryId",
                "FundCategorys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}