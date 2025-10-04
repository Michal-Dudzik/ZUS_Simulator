using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ZusSimulator.Data.Migrations
{
    /// <inheritdoc />
    public partial class addFormResultsAdvanced : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountBalance",
                table: "SimpleFormResults");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "SimpleFormResults");

            migrationBuilder.DropColumn(
                name: "SickLeaveDays",
                table: "SimpleFormResults");

            migrationBuilder.DropColumn(
                name: "SubAccountBalance",
                table: "SimpleFormResults");

            migrationBuilder.CreateTable(
                name: "AdvancedFormResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CurrentAge = table.Column<int>(type: "integer", nullable: false),
                    MonthlyIncome = table.Column<decimal>(type: "numeric", nullable: false),
                    EmploymentType = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    WorkStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InitialCapital = table.Column<decimal>(type: "numeric", nullable: false),
                    RetirementAge = table.Column<int>(type: "integer", nullable: false),
                    AccountBalance = table.Column<decimal>(type: "numeric", nullable: false),
                    SubAccountBalance = table.Column<decimal>(type: "numeric", nullable: false),
                    SickLeaveDays = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvancedFormResults", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdvancedFormResults");

            migrationBuilder.AddColumn<decimal>(
                name: "AccountBalance",
                table: "SimpleFormResults",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "SimpleFormResults",
                type: "character varying(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SickLeaveDays",
                table: "SimpleFormResults",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SubAccountBalance",
                table: "SimpleFormResults",
                type: "numeric",
                nullable: true);
        }
    }
}
