using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMoneyRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "money_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    requester_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    requester_wallet_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    payer_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    transaction_id = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    responded_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    expires_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_money_requests", x => x.id);
                    table.ForeignKey(
                        name: "FK_money_requests_Transactions_transaction_id",
                        column: x => x.transaction_id,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_money_requests_Users_payer_id",
                        column: x => x.payer_id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_money_requests_Users_requester_id",
                        column: x => x.requester_id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_money_requests_Wallets_requester_wallet_id",
                        column: x => x.requester_wallet_id,
                        principalTable: "Wallets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "idx_money_requests_payer",
                table: "money_requests",
                column: "payer_id");

            migrationBuilder.CreateIndex(
                name: "idx_money_requests_requester",
                table: "money_requests",
                column: "requester_id");

            migrationBuilder.CreateIndex(
                name: "idx_money_requests_status",
                table: "money_requests",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_money_requests_requester_wallet_id",
                table: "money_requests",
                column: "requester_wallet_id");

            migrationBuilder.CreateIndex(
                name: "IX_money_requests_transaction_id",
                table: "money_requests",
                column: "transaction_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "money_requests");
        }
    }
}
