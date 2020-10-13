using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class renameAddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                "RegisteredCompany_Unit",
                "Providers",
                "RegisteredCompanyAddress_Unit");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_StreetNumber",
                "Providers",
                "RegisteredCompanyAddress_StreetNumber");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_StreetName",
                "Providers",
                "RegisteredCompanyAddress_StreetName");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_State",
                "Providers",
                "RegisteredCompanyAddress_State");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_PostCode",
                "Providers",
                "RegisteredCompanyAddress_PostCode");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_City",
                "Providers",
                "RegisteredCompanyAddress_City");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_Address",
                "Providers",
                "RegisteredCompanyAddress_Address");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_Unit",
                "Providers",
                "RegisteredCompany_Unit");

            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_StreetNumber",
                "Providers",
                "RegisteredCompany_StreetNumber");

            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_StreetName",
                "Providers",
                "RegisteredCompany_StreetName");

            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_State",
                "Providers",
                "RegisteredCompany_State");

            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_PostCode",
                "Providers",
                "RegisteredCompany_PostCode");

            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_City",
                "Providers",
                "RegisteredCompany_City");

            migrationBuilder.RenameColumn(
                "RegisteredCompanyAddress_Address",
                "Providers",
                "RegisteredCompany_Address");
        }
    }
}