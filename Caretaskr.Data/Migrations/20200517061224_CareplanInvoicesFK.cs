using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class CareplanInvoicesFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                "RegisteredById",
                "InvoiceItem",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                "RegisteredByName",
                "InvoiceItem",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "CarePlanId",
                "Invoice",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_Invoice_CarePlanId",
                "Invoice",
                "CarePlanId");

            migrationBuilder.AddForeignKey(
                "FK_Invoice_Careplans_CarePlanId",
                "Invoice",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Invoice_Careplans_CarePlanId",
                "Invoice");

            migrationBuilder.DropIndex(
                "IX_Invoice_CarePlanId",
                "Invoice");

            migrationBuilder.DropColumn(
                "RegisteredById",
                "InvoiceItem");

            migrationBuilder.DropColumn(
                "RegisteredByName",
                "InvoiceItem");

            migrationBuilder.DropColumn(
                "CarePlanId",
                "Invoice");
        }
    }
}