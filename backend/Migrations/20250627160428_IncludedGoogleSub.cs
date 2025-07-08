using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasksHubServer.Migrations
{
    /// <inheritdoc />
    public partial class IncludedGoogleSub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GoogleSub",
                table: "ApplicationUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GoogleSub",
                table: "ApplicationUsers");
        }
    }
}
