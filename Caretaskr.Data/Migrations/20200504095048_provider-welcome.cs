using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class providerwelcome : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "Email",
                "Providers");

            migrationBuilder.DropColumn(
                "EntityName",
                "Providers");

            migrationBuilder.DropColumn(
                "IsNDISRegistered",
                "Providers");

            migrationBuilder.DropColumn(
                "OtherServices",
                "Providers");

            migrationBuilder.RenameColumn(
                "Unit",
                "Providers",
                "RegisteredCompany_Unit");

            migrationBuilder.RenameColumn(
                "StreetNumber",
                "Providers",
                "RegisteredCompany_StreetNumber");

            migrationBuilder.RenameColumn(
                "StreetName",
                "Providers",
                "RegisteredCompany_StreetName");

            migrationBuilder.RenameColumn(
                "State",
                "Providers",
                "RegisteredCompany_State");

            migrationBuilder.RenameColumn(
                "PostCode",
                "Providers",
                "RegisteredCompany_PostCode");

            migrationBuilder.RenameColumn(
                "City",
                "Providers",
                "RegisteredCompany_City");

            migrationBuilder.RenameColumn(
                "Address",
                "Providers",
                "RegisteredCompany_Address");

            migrationBuilder.AddColumn<string>(
                "BusinessEmail",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessWebSite",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "CompanyName",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "MedicareRegistrationNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "NDISRegistrationNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Services",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_Address",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_City",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_PostCode",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_State",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_StreetName",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_StreetNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "BusinessAddress_Unit",
                "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "BusinessEmail",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessWebSite",
                "Providers");

            migrationBuilder.DropColumn(
                "CompanyName",
                "Providers");

            migrationBuilder.DropColumn(
                "MedicareRegistrationNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "NDISRegistrationNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "Services",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_Address",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_City",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_PostCode",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_State",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_StreetName",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_StreetNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "BusinessAddress_Unit",
                "Providers");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_Unit",
                "Providers",
                "Unit");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_StreetNumber",
                "Providers",
                "StreetNumber");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_StreetName",
                "Providers",
                "StreetName");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_State",
                "Providers",
                "State");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_PostCode",
                "Providers",
                "PostCode");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_City",
                "Providers",
                "City");

            migrationBuilder.RenameColumn(
                "RegisteredCompany_Address",
                "Providers",
                "Address");

            migrationBuilder.AddColumn<string>(
                "Email",
                "Providers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "EntityName",
                "Providers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                "IsNDISRegistered",
                "Providers",
                "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                "OtherServices",
                "Providers",
                "nvarchar(max)",
                nullable: true);
        }
    }
}