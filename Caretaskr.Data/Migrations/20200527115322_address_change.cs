using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class address_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Address_AspNetUsers_CreatedById",
                "Address");

            migrationBuilder.DropForeignKey(
                "FK_Address_AspNetUsers_ModifiedById",
                "Address");

            migrationBuilder.DropIndex(
                "IX_Address_CreatedById",
                "Address");

            migrationBuilder.DropIndex(
                "IX_Address_ModifiedById",
                "Address");

            migrationBuilder.DropColumn(
                "SchoolAddress",
                "Patients");

            migrationBuilder.DropColumn(
                "Address",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "City",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "Latitude",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "Longitude",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "PostCode",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "State",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "StreetName",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "StreetNumber",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "Unit",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "CreatedById",
                "Address");

            migrationBuilder.DropColumn(
                "CreatedDate",
                "Address");

            migrationBuilder.DropColumn(
                "ModifiedById",
                "Address");

            migrationBuilder.DropColumn(
                "ModifiedDate",
                "Address");

            migrationBuilder.DropColumn(
                "PublicId",
                "Address");

            migrationBuilder.AddColumn<int>(
                "SchoolAddressId",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "AddressId",
                "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_Patients_SchoolAddressId",
                "Patients",
                "SchoolAddressId");

            migrationBuilder.CreateIndex(
                "IX_AspNetUsers_AddressId",
                "AspNetUsers",
                "AddressId");

            migrationBuilder.AddForeignKey(
                "FK_AspNetUsers_Address_AddressId",
                "AspNetUsers",
                "AddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Patients_Address_SchoolAddressId",
                "Patients",
                "SchoolAddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_AspNetUsers_Address_AddressId",
                "AspNetUsers");

            migrationBuilder.DropForeignKey(
                "FK_Patients_Address_SchoolAddressId",
                "Patients");

            migrationBuilder.DropIndex(
                "IX_Patients_SchoolAddressId",
                "Patients");

            migrationBuilder.DropIndex(
                "IX_AspNetUsers_AddressId",
                "AspNetUsers");

            migrationBuilder.DropColumn(
                "SchoolAddressId",
                "Patients");

            migrationBuilder.DropColumn(
                "AddressId",
                "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                "SchoolAddress",
                "Patients",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Address",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "City",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                "Latitude",
                "AspNetUsers",
                "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                "Longitude",
                "AspNetUsers",
                "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                "PostCode",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "State",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetName",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "StreetNumber",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Unit",
                "AspNetUsers",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "CreatedById",
                "Address",
                "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "CreatedDate",
                "Address",
                "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                "ModifiedById",
                "Address",
                "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "ModifiedDate",
                "Address",
                "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "PublicId",
                "Address",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_Address_CreatedById",
                "Address",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Address_ModifiedById",
                "Address",
                "ModifiedById");

            migrationBuilder.AddForeignKey(
                "FK_Address_AspNetUsers_CreatedById",
                "Address",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Address_AspNetUsers_ModifiedById",
                "Address",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}