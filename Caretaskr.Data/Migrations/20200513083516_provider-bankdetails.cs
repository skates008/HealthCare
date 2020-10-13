using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class providerbankdetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Invoice_BillingRun_BillingRunId",
                "Invoice");

            migrationBuilder.DropColumn(
                "ClientName",
                "InvoiceItem");

            migrationBuilder.AddColumn<string>(
                "CustomerName",
                "InvoiceItem",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                "BillingRunId",
                "Invoice",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                "PaymentDueInDays",
                "Invoice",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "PaymentDueInDays",
                "BillingSettings",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                "ProviderBankDetails",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    BankAccountName = table.Column<string>(nullable: true),
                    BankAccountNumber = table.Column<string>(nullable: true),
                    BICSWIFTCode = table.Column<string>(nullable: true),
                    BankAddress_Address = table.Column<string>(nullable: true),
                    BankAddress_State = table.Column<string>(nullable: true),
                    BankAddress_StreetNumber = table.Column<string>(nullable: true),
                    BankAddress_StreetName = table.Column<string>(nullable: true),
                    BankAddress_Unit = table.Column<string>(nullable: true),
                    BankAddress_City = table.Column<string>(nullable: true),
                    BankAddress_PostCode = table.Column<string>(nullable: true),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderBankDetails", x => x.Id);
                    table.ForeignKey(
                        "FK_ProviderBankDetails_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ProviderBankDetails_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ProviderBankDetails_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_ProviderBankDetails_CreatedById",
                "ProviderBankDetails",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_ProviderBankDetails_ModifiedById",
                "ProviderBankDetails",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_ProviderBankDetails_ProviderId",
                "ProviderBankDetails",
                "ProviderId");

            migrationBuilder.AddForeignKey(
                "FK_Invoice_BillingRun_BillingRunId",
                "Invoice",
                "BillingRunId",
                "BillingRun",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Invoice_BillingRun_BillingRunId",
                "Invoice");

            migrationBuilder.DropTable(
                "ProviderBankDetails");

            migrationBuilder.DropColumn(
                "CustomerName",
                "InvoiceItem");

            migrationBuilder.DropColumn(
                "PaymentDueInDays",
                "Invoice");

            migrationBuilder.DropColumn(
                "PaymentDueInDays",
                "BillingSettings");

            migrationBuilder.AddColumn<string>(
                "ClientName",
                "InvoiceItem",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                "BillingRunId",
                "Invoice",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                "FK_Invoice_BillingRun_BillingRunId",
                "Invoice",
                "BillingRunId",
                "BillingRun",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}