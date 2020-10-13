using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class BillingDetailsAddressFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_BillingDetails_AddressId",
                "BillingDetails");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_AddressId",
                "BillingDetails",
                "AddressId",
                unique: true,
                filter: "[AddressId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_BillingDetails_AddressId",
                "BillingDetails");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_AddressId",
                "BillingDetails",
                "AddressId");
        }
    }
}