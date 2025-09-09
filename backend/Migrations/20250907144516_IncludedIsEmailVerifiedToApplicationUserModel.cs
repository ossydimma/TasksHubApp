using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasksHubServer.Migrations
{
    /// <inheritdoc />
    public partial class IncludedIsEmailVerifiedToApplicationUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEmailVerified",
                table: "ApplicationUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEmailVerified",
                table: "ApplicationUsers");
        }
    }
}
