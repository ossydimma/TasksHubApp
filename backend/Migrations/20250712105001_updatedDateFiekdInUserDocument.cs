using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasksHubServer.Migrations
{
    /// <inheritdoc />
    public partial class updatedDateFiekdInUserDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CurrentDate",
                table: "UserDocuments",
                newName: "Date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "UserDocuments",
                newName: "CurrentDate");
        }
    }
}
