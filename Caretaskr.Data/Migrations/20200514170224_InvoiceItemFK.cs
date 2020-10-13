using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class InvoiceItemFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntryBillableItem_Invoice_InvoiceId",
                "TimeEntryBillableItem");

            migrationBuilder.DropIndex(
                "IX_TimeEntryBillableItem_InvoiceId",
                "TimeEntryBillableItem");

            migrationBuilder.DropIndex(
                "IX_InvoiceItem_TimeEntryBillableItemId",
                "InvoiceItem");

            migrationBuilder.DropColumn(
                "DurationInMinutes",
                "TimeEntryBillableItem");

            migrationBuilder.DropColumn(
                "InvoiceId",
                "TimeEntryBillableItem");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_TimeEntryBillableItemId",
                "InvoiceItem",
                "TimeEntryBillableItemId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_InvoiceItem_TimeEntryBillableItemId",
                "InvoiceItem");

            migrationBuilder.AddColumn<int>(
                "DurationInMinutes",
                "TimeEntryBillableItem",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "InvoiceId",
                "TimeEntryBillableItem",
                "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_InvoiceId",
                "TimeEntryBillableItem",
                "InvoiceId");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_TimeEntryBillableItemId",
                "InvoiceItem",
                "TimeEntryBillableItemId");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntryBillableItem_Invoice_InvoiceId",
                "TimeEntryBillableItem",
                "InvoiceId",
                "Invoice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}