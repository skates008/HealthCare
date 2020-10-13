using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class createTeams : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Team",
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
                    Name = table.Column<string>(nullable: true),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Team", x => x.Id);
                    table.ForeignKey(
                        "FK_Team_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Team_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Team_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "TeamUser",
                table => new
                {
                    TeamId = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamUser", x => new {x.UserId, x.TeamId});
                    table.ForeignKey(
                        "FK_TeamUser_Team_TeamId",
                        x => x.TeamId,
                        "Team",
                        "Id");
                    table.ForeignKey(
                        "FK_TeamUser_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_Team_CreatedById",
                "Team",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Team_ModifiedById",
                "Team",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Team_ProviderId",
                "Team",
                "ProviderId");

            migrationBuilder.CreateIndex(
                "IX_TeamUser_TeamId",
                "TeamUser",
                "TeamId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "TeamUser");

            migrationBuilder.DropTable(
                "Team");
        }
    }
}