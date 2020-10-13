using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class UpdateTimeEntryBillableItemCostType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntryUser_TimeEntry_TimeEntryId1",
                "TimeEntryUser");

            migrationBuilder.DropIndex(
                "IX_TimeEntryUser_TimeEntryId1",
                "TimeEntryUser");

            migrationBuilder.DropColumn(
                "TimeEntryId1",
                "TimeEntryUser");

            migrationBuilder.RenameColumn(
                "quantity",
                "TimeEntryBillableItem",
                "Quantity");

            migrationBuilder.RenameColumn(
                "cost",
                "TimeEntryBillableItem",
                "Cost");

            migrationBuilder.AlterColumn<decimal>(
                "Quantity",
                "TimeEntryBillableItem",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                "Cost",
                "TimeEntryBillableItem",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<int>(
                "TimeEntryId1",
                "TimeEntryBillableItem",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_TimeEntryId1",
                "TimeEntryBillableItem",
                "TimeEntryId1");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntryBillableItem_TimeEntry_TimeEntryId1",
                "TimeEntryBillableItem",
                "TimeEntryId1",
                "TimeEntry",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntryBillableItem_TimeEntry_TimeEntryId1",
                "TimeEntryBillableItem");

            migrationBuilder.DropIndex(
                "IX_TimeEntryBillableItem_TimeEntryId1",
                "TimeEntryBillableItem");

            migrationBuilder.DropColumn(
                "TimeEntryId1",
                "TimeEntryBillableItem");

            migrationBuilder.RenameColumn(
                "Quantity",
                "TimeEntryBillableItem",
                "quantity");

            migrationBuilder.RenameColumn(
                "Cost",
                "TimeEntryBillableItem",
                "cost");

            migrationBuilder.AddColumn<int>(
                "TimeEntryId1",
                "TimeEntryUser",
                "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                "quantity",
                "TimeEntryBillableItem",
                "int",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<double>(
                "cost",
                "TimeEntryBillableItem",
                "float",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.CreateIndex(
                "IX_TimeEntryUser_TimeEntryId1",
                "TimeEntryUser",
                "TimeEntryId1");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntryUser_TimeEntry_TimeEntryId1",
                "TimeEntryUser",
                "TimeEntryId1",
                "TimeEntry",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}