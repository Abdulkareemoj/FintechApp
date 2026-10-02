// ============================================
// FILE: Controllers/UserDashboard/StatementsController.cs
// PURPOSE: CSV statement export for users
// ============================================

using System.Globalization;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Services.UserDashboard;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/statements")]
    public class StatementsController : ControllerBase
    {
        private static readonly string[] AllowedDirections = { "all", "incoming", "outgoing" };

        private readonly ITransactionService _transactionService;
        private readonly ILogger<StatementsController> _logger;

        public StatementsController(
            ITransactionService transactionService,
            ILogger<StatementsController> logger)
        {
            _transactionService = transactionService;
            _logger = logger;
        }

        /// <summary>
        /// Export transactions in a date range as a CSV statement
        /// </summary>
        [HttpGet("export")]
        public async Task<IActionResult> Export([FromQuery] StatementQueryParams queryParams)
        {
            try
            {
                if (queryParams.StartDate.HasValue && queryParams.EndDate.HasValue &&
                    queryParams.StartDate.Value > queryParams.EndDate.Value)
                {
                    return BadRequest(new { success = false, error = "Start date must be on or before end date" });
                }

                var direction = queryParams.Direction?.ToLowerInvariant() ?? "all";
                if (!AllowedDirections.Contains(direction))
                {
                    return BadRequest(new { success = false, error = "Direction must be one of: all, incoming, outgoing" });
                }

                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                queryParams.Direction = direction;

                var rows = await _transactionService.GetStatementRowsAsync(userId, queryParams);

                var csv = BuildCsv(rows);
                var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv)).ToArray();
                var fileName = BuildFileName(queryParams);

                return File(bytes, "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Statement export failed for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return StatusCode(500, new { success = false, error = "Failed to export statement" });
            }
        }

        private static string BuildCsv(List<StatementRowDto> rows)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Date,Type,Direction,Description,Reference,Amount,Currency,Status");

            foreach (var row in rows)
            {
                sb.Append(Escape(row.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)));
                sb.Append(',');
                sb.Append(Escape(row.Type));
                sb.Append(',');
                sb.Append(Escape(row.Direction));
                sb.Append(',');
                sb.Append(Escape(row.Description));
                sb.Append(',');
                sb.Append(Escape(row.ReferenceId));
                sb.Append(',');
                sb.Append(row.Amount.ToString("0.00", CultureInfo.InvariantCulture));
                sb.Append(',');
                sb.Append(Escape(row.Currency));
                sb.Append(',');
                sb.Append(Escape(row.Status));
                sb.AppendLine();
            }

            return sb.ToString();
        }

        private static string Escape(string? value)
        {
            if (string.IsNullOrEmpty(value))
                return string.Empty;

            if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
                return $"\"{value.Replace("\"", "\"\"")}\"";

            return value;
        }

        private static string BuildFileName(StatementQueryParams queryParams)
        {
            var start = queryParams.StartDate?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? "all";
            var end = queryParams.EndDate?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? "all";
            return $"account_statement_{start}_{end}.csv";
        }
    }
}
