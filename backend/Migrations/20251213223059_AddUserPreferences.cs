using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPreferences : Migration
    {
        /// <inheritdoc />
       protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BudgetMin = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BudgetMax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinDuration = table.Column<int>(type: "int", nullable: false),
                    MaxDuration = table.Column<int>(type: "int", nullable: false),
                    TravelDateStart = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TravelDateEnd = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PreferredDestinations = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TravelStyle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroupSize = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityLevel = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UserId",
                table: "UserPreferences",
                column: "UserId",
                unique: true);

                migrationBuilder.AddColumn<int>(
                name: "AvailableSpots",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalSpots",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MainImage",
                table: "Trips",
                type: "nvarchar(500)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImages",
                table: "Trips",
                type: "nvarchar(max)",  // ← lowercase "max"
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserPreferences");

                migrationBuilder.DropColumn(
                name: "AvailableSpots",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "TotalSpots",
                table: "Trips");
            
            migrationBuilder.DropColumn(
                name: "MainImage",
                table: "Trips");
            
            migrationBuilder.DropColumn(
                name: "GalleryImages",
                table: "Trips");
        }
    }
}
