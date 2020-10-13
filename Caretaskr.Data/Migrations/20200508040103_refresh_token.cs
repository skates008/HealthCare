using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class refresh_token : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "AspNetRefreshToken",
                table => new
                {
                    Id = table.Column<string>(nullable: false),
                    IssuedUtc = table.Column<DateTime>(nullable: false),
                    ExpiresUtc = table.Column<DateTime>(nullable: false),
                    Token = table.Column<string>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRefreshToken", x => x.Id);
                    table.UniqueConstraint("AK_AspNetRefreshToken_Token", x => x.Token);
                    table.UniqueConstraint("AK_AspNetRefreshToken_UserId", x => x.UserId);
                    table.ForeignKey(
                        "FK_AspNetRefreshToken_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "AspNetRefreshToken");
        }
    }
}