using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class prov : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillableItem_Provider_ProviderId",
                "BillableItem");

            migrationBuilder.DropForeignKey(
                "FK_PatientRecord_Provider_ProviderId",
                "PatientRecord");

            migrationBuilder.DropForeignKey(
                "FK_Provider_AspNetUsers_CreatedById",
                "Provider");

            migrationBuilder.DropForeignKey(
                "FK_Provider_AspNetUsers_ModifiedById",
                "Provider");

            migrationBuilder.DropForeignKey(
                "FK_ProviderUser_Provider_ProviderId",
                "ProviderUser");

            migrationBuilder.DropForeignKey(
                "FK_ProviderUser_AspNetUsers_UserId",
                "ProviderUser");

            migrationBuilder.DropPrimaryKey(
                "PK_ProviderUser",
                "ProviderUser");

            migrationBuilder.DropPrimaryKey(
                "PK_Provider",
                "Provider");

            migrationBuilder.RenameTable(
                "ProviderUser",
                newName: "ProviderUsers");

            migrationBuilder.RenameTable(
                "Provider",
                newName: "Providers");

            migrationBuilder.RenameIndex(
                "IX_ProviderUser_ProviderId",
                table: "ProviderUsers",
                newName: "IX_ProviderUsers_ProviderId");

            migrationBuilder.RenameIndex(
                "IX_Provider_ModifiedById",
                table: "Providers",
                newName: "IX_Providers_ModifiedById");

            migrationBuilder.RenameIndex(
                "IX_Provider_CreatedById",
                table: "Providers",
                newName: "IX_Providers_CreatedById");

            migrationBuilder.AddPrimaryKey(
                "PK_ProviderUsers",
                "ProviderUsers",
                new[] {"UserId", "ProviderId"});

            migrationBuilder.AddPrimaryKey(
                "PK_Providers",
                "Providers",
                "Id");

            migrationBuilder.AddForeignKey(
                "FK_BillableItem_Providers_ProviderId",
                "BillableItem",
                "ProviderId",
                "Providers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_PatientRecord_Providers_ProviderId",
                "PatientRecord",
                "ProviderId",
                "Providers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                "FK_Providers_AspNetUsers_CreatedById",
                "Providers",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Providers_AspNetUsers_ModifiedById",
                "Providers",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_ProviderUsers_Providers_ProviderId",
                "ProviderUsers",
                "ProviderId",
                "Providers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                "FK_ProviderUsers_AspNetUsers_UserId",
                "ProviderUsers",
                "UserId",
                "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillableItem_Providers_ProviderId",
                "BillableItem");

            migrationBuilder.DropForeignKey(
                "FK_PatientRecord_Providers_ProviderId",
                "PatientRecord");

            migrationBuilder.DropForeignKey(
                "FK_Providers_AspNetUsers_CreatedById",
                "Providers");

            migrationBuilder.DropForeignKey(
                "FK_Providers_AspNetUsers_ModifiedById",
                "Providers");

            migrationBuilder.DropForeignKey(
                "FK_ProviderUsers_Providers_ProviderId",
                "ProviderUsers");

            migrationBuilder.DropForeignKey(
                "FK_ProviderUsers_AspNetUsers_UserId",
                "ProviderUsers");

            migrationBuilder.DropPrimaryKey(
                "PK_ProviderUsers",
                "ProviderUsers");

            migrationBuilder.DropPrimaryKey(
                "PK_Providers",
                "Providers");

            migrationBuilder.RenameTable(
                "ProviderUsers",
                newName: "ProviderUser");

            migrationBuilder.RenameTable(
                "Providers",
                newName: "Provider");

            migrationBuilder.RenameIndex(
                "IX_ProviderUsers_ProviderId",
                table: "ProviderUser",
                newName: "IX_ProviderUser_ProviderId");

            migrationBuilder.RenameIndex(
                "IX_Providers_ModifiedById",
                table: "Provider",
                newName: "IX_Provider_ModifiedById");

            migrationBuilder.RenameIndex(
                "IX_Providers_CreatedById",
                table: "Provider",
                newName: "IX_Provider_CreatedById");

            migrationBuilder.AddPrimaryKey(
                "PK_ProviderUser",
                "ProviderUser",
                new[] {"UserId", "ProviderId"});

            migrationBuilder.AddPrimaryKey(
                "PK_Provider",
                "Provider",
                "Id");

            migrationBuilder.AddForeignKey(
                "FK_BillableItem_Provider_ProviderId",
                "BillableItem",
                "ProviderId",
                "Provider",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_PatientRecord_Provider_ProviderId",
                "PatientRecord",
                "ProviderId",
                "Provider",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                "FK_Provider_AspNetUsers_CreatedById",
                "Provider",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Provider_AspNetUsers_ModifiedById",
                "Provider",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_ProviderUser_Provider_ProviderId",
                "ProviderUser",
                "ProviderId",
                "Provider",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                "FK_ProviderUser_AspNetUsers_UserId",
                "ProviderUser",
                "UserId",
                "AspNetUsers",
                principalColumn: "Id");
        }
    }
}