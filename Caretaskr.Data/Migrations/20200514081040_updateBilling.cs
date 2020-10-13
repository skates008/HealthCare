using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class updateBilling : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "BillingDayOfMonth",
                "BillingRun");

            migrationBuilder.DropColumn(
                "BillingDayOfWeek",
                "BillingRun");

            migrationBuilder.DropColumn(
                "BillingWeekCycle",
                "BillingRun");

            migrationBuilder.DropColumn(
                "BillingcConfSnapshot",
                "BillingRun");

            migrationBuilder.DropColumn(
                "FirstRunDate",
                "BillingRun");

            migrationBuilder.DropColumn(
                "PaymentDueInDays",
                "BillingRun");

            migrationBuilder.RenameColumn(
                "runDate",
                "BillingRun",
                "RunDate");

            migrationBuilder.AddColumn<string>(
                "DownloadPdfUrl",
                "Invoice",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "TriggerType",
                "Invoice",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "BillingType",
                "Careplans",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "BillingTimeOfDay",
                "BillingSettings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "InvoicePaymentText",
                "BillingSettings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "InvoiceReferenceFormat",
                "BillingSettings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BillingConfSnapshot",
                "BillingRun",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "ExecutionDate",
                "BillingRun",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                "Observations",
                "BillingRun",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "ProviderId",
                "BillingRun",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_BillingRun_ProviderId",
                "BillingRun",
                "ProviderId");

            migrationBuilder.AddForeignKey(
                "FK_BillingRun_Providers_ProviderId",
                "BillingRun",
                "ProviderId",
                "Providers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingRun_Providers_ProviderId",
                "BillingRun");

            migrationBuilder.DropIndex(
                "IX_BillingRun_ProviderId",
                "BillingRun");

            migrationBuilder.DropColumn(
                "DownloadPdfUrl",
                "Invoice");

            migrationBuilder.DropColumn(
                "TriggerType",
                "Invoice");

            migrationBuilder.DropColumn(
                "BillingType",
                "Careplans");

            migrationBuilder.DropColumn(
                "BillingTimeOfDay",
                "BillingSettings");

            migrationBuilder.DropColumn(
                "InvoicePaymentText",
                "BillingSettings");

            migrationBuilder.DropColumn(
                "InvoiceReferenceFormat",
                "BillingSettings");

            migrationBuilder.DropColumn(
                "BillingConfSnapshot",
                "BillingRun");

            migrationBuilder.DropColumn(
                "ExecutionDate",
                "BillingRun");

            migrationBuilder.DropColumn(
                "Observations",
                "BillingRun");

            migrationBuilder.DropColumn(
                "ProviderId",
                "BillingRun");

            migrationBuilder.RenameColumn(
                "RunDate",
                "BillingRun",
                "runDate");

            migrationBuilder.AddColumn<int>(
                "BillingDayOfMonth",
                "BillingRun",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "BillingDayOfWeek",
                "BillingRun",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "BillingWeekCycle",
                "BillingRun",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "BillingcConfSnapshot",
                "BillingRun",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "FirstRunDate",
                "BillingRun",
                "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                "PaymentDueInDays",
                "BillingRun",
                "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}