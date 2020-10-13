using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class upload : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "ProviderDocument",
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
                    FileName = table.Column<string>(nullable: false),
                    DocumentType = table.Column<string>(nullable: true),
                    DocumentTypeId = table.Column<int>(nullable: false),
                    DocumentPath = table.Column<string>(nullable: true),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderDocument", x => x.Id);
                    table.ForeignKey(
                        "FK_ProviderDocument_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ProviderDocument_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ProviderDocument_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "UserDocument",
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
                    UserId = table.Column<Guid>(nullable: false),
                    FileName = table.Column<string>(nullable: false),
                    DocumentType = table.Column<string>(nullable: true),
                    DocumentTypeId = table.Column<int>(nullable: false),
                    DocumentPath = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDocument", x => x.Id);
                    table.ForeignKey(
                        "FK_UserDocument_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_UserDocument_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_UserDocument_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_ProviderDocument_CreatedById",
                "ProviderDocument",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_ProviderDocument_ModifiedById",
                "ProviderDocument",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_ProviderDocument_ProviderId",
                "ProviderDocument",
                "ProviderId");

            migrationBuilder.CreateIndex(
                "IX_UserDocument_CreatedById",
                "UserDocument",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_UserDocument_ModifiedById",
                "UserDocument",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_UserDocument_UserId",
                "UserDocument",
                "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "ProviderDocument");

            migrationBuilder.DropTable(
                "UserDocument");
        }
    }
}