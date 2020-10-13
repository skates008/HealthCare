using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class BillingDetailsRenaming : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_Address_BillingAddressId",
                "BillingDetails");

            migrationBuilder.DropIndex(
                "IX_BillingDetails_BillingAddressId",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "BillingAccountNumber",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "BillingAddressId",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "BillingEmail",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "BillingTermsOfService",
                "BillingDetails");

            migrationBuilder.AddColumn<string>(
                "AccountNumber",
                "BillingDetails",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "AddressId",
                "BillingDetails",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TermsOfService",
                "BillingDetails",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_AddressId",
                "BillingDetails",
                "AddressId");

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_Address_AddressId",
                "BillingDetails",
                "AddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_Address_AddressId",
                "BillingDetails");

            migrationBuilder.DropIndex(
                "IX_BillingDetails_AddressId",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "AccountNumber",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "AddressId",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "TermsOfService",
                "BillingDetails");

            migrationBuilder.AddColumn<string>(
                "BillingAccountNumber",
                "BillingDetails",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "BillingAddressId",
                "BillingDetails",
                "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BillingEmail",
                "BillingDetails",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BillingTermsOfService",
                "BillingDetails",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_BillingAddressId",
                "BillingDetails",
                "BillingAddressId");

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_Address_BillingAddressId",
                "BillingDetails",
                "BillingAddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}