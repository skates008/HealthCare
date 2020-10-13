using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddProvider : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "providerId",
                "Patients",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                "Provider",
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
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provider", x => x.Id);
                    table.ForeignKey(
                        "FK_Provider_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Provider_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "ProviderUser",
                table => new
                {
                    ProviderId = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderUser", x => new {x.UserId, x.ProviderId});
                    table.ForeignKey(
                        "FK_ProviderUser_Provider_ProviderId",
                        x => x.ProviderId,
                        "Provider",
                        "Id");
                    table.ForeignKey(
                        "FK_ProviderUser_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_Patients_providerId",
                "Patients",
                "providerId");

            migrationBuilder.CreateIndex(
                "IX_Provider_CreatedById",
                "Provider",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Provider_ModifiedById",
                "Provider",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_ProviderUser_ProviderId",
                "ProviderUser",
                "ProviderId");

            migrationBuilder.AddForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients",
                "providerId",
                "Provider",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients");

            migrationBuilder.DropTable(
                "ProviderUser");

            migrationBuilder.DropTable(
                "Provider");

            migrationBuilder.DropIndex(
                "IX_Patients_providerId",
                "Patients");

            migrationBuilder.DropColumn(
                "providerId",
                "Patients");
        }
    }
}