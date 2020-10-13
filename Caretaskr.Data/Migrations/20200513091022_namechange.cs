using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class namechange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "BankAccountName",
                "ProviderBankDetails");

            migrationBuilder.DropColumn(
                "BankAccountNumber",
                "ProviderBankDetails");

            migrationBuilder.AddColumn<string>(
                "AccountNumber",
                "ProviderBankDetails",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BankName",
                "ProviderBankDetails",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "AccountNumber",
                "ProviderBankDetails");

            migrationBuilder.DropColumn(
                "BankName",
                "ProviderBankDetails");

            migrationBuilder.AddColumn<string>(
                "BankAccountName",
                "ProviderBankDetails",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BankAccountNumber",
                "ProviderBankDetails",
                "nvarchar(max)",
                nullable: true);
        }
    }
}