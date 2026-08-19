using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.Enums;
using FinTech.Services;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.MemoryStorage;
using Hangfire.SqlServer;
using Scalar.AspNetCore;
using Microsoft.OpenApi.Models;
using FinTech.Services.UserDashboard;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = CreateSerilogLogger(builder);
builder.Host.UseSerilog();

static Serilog.ILogger CreateSerilogLogger(WebApplicationBuilder builder)
{
    return new LoggerConfiguration()
        .ReadFrom.Configuration(builder.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "FinTech")
        .Enrich.WithProperty("Environment", builder.Environment.EnvironmentName)
        .WriteTo.Console(outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
        .WriteTo.File(
            path: "logs/fintech-.txt",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30,
            outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
        .CreateLogger(); 
}

// ============================================
// DATABASE CONTEXT
// ============================================
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions =>
        {
            //sqlServerOptions.UseNetTopologySuite();
            sqlServerOptions.EnableRetryOnFailure();
        });

    // Enable detailed errors in development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// ============================================
// JWT CONFIGURATION
// ============================================
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()
    ?? throw new InvalidOperationException("JWT settings not found");

var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Remove default 5 minute tolerance
    };

    // Add logging for authentication failures
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Log.Warning("Authentication failed: {Error}", context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var userId = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Log.Information("Token validated for user: {UserId}", userId);
            return Task.CompletedTask;
        }
    };
});

// ============================================
// AUTHORIZATION POLICIES
// ============================================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("SupportOrAdmin", policy =>
        policy.RequireRole("Admin", "Support"));

    options.AddPolicy("UserOnly", policy =>
        policy.RequireRole("User"));

    options.AddPolicy("MerchantOrAdmin", policy =>
        policy.RequireRole("Admin", "Merchant"));
});

// ============================================
// DEPENDENCY INJECTION - SERVICES
// ============================================
// Auth Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// User Dashboard Services
builder.Services.AddScoped<IWalletService, WalletService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<IDepositService, DepositService>();
builder.Services.AddScoped<IRecipientLookupService, RecipientLookupService>();
builder.Services.AddScoped<IMoneyRequestService, MoneyRequestService>();
builder.Services.AddScoped<ISupportService, SupportService>();
builder.Services.AddScoped<IHelpService, HelpService>();
builder.Services.AddScoped<IInboxService, InboxService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddMemoryCache(); // For caching

// ============================================
// CORS
// ============================================
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:3000",  // Add other frontend URLs as needed
                "https://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ============================================
// HANGFIRE (Background Jobs)
// ============================================
builder.Services.AddHangfire(config =>
{
    // Use SQL Server instead of memory storage for production
    if (builder.Environment.IsProduction())
    {
        config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
    else
    {
        config.UseMemoryStorage();
    }
});

builder.Services.AddHangfireServer();

// ============================================
// CONTROLLERS & API CONFIGURATION
// ============================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use camelCase for JSON responses
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        // Handle enum as strings
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// ============================================
// OPENAPI / SWAGGER WITH SCALAR
// ============================================
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info = new OpenApiInfo
        {
            Title = "FinTech Payment API",
            Version = "v1",
            Description = "RESTful API for digital payments, wallets, and transfers"
        };
        return Task.CompletedTask;
    });
});

// Add Swagger/OpenAPI with JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FinTech Payment API",
        Version = "v1",
        Description = "RESTful API for digital payments, wallets, and transfers",
        Contact = new OpenApiContact
        {
            Name = "FinTech Support",
            Email = "support@fintech.com"
        }
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ============================================
// BUILD APPLICATION
// ============================================
var app = builder.Build();

// ============================================
// MIDDLEWARE PIPELINE
// ============================================

// Serilog request logging
app.UseSerilogRequestLogging(options =>
{
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());

        // Add user info if authenticated
        if (httpContext.User.Identity?.IsAuthenticated == true)
        {
            var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            diagnosticContext.Set("UserId", userId);
        }
    };
});

// Development-only features
if (app.Environment.IsDevelopment())
{
    // Auto-migrate database on startup
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();
            Log.Information("Database migration completed successfully");

            SeedDefaultData(db);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred while migrating the database");
        }
    }

    // Swagger UI
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "FinTech API v1");
        options.RoutePrefix = "swagger"; // Access at /swagger
    });

    // Scalar API Documentation (Better UI than Swagger)
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("FinTech Payment API")
            .WithTheme(ScalarTheme.Purple)
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });

    app.MapOpenApi();
}

// CORS must be before authentication
app.UseCors();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Hangfire Dashboard (Admin only in production)
app.UseHangfireDashboard("/hangfire", new Hangfire.DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter(app.Environment) }
});

// Map controllers
app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    RecurringJob.AddOrUpdate<IMoneyRequestService>(
        "expire-stale-money-requests",
        svc => svc.ExpireStaleRequestsAsync(),
        Cron.Daily);
}
// Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
}))
.WithName("HealthCheck")
.WithOpenApi();

// Root endpoint
app.MapGet("/", () => Results.Ok(new
{
    name = "FinTech Payment API",
    version = "1.0.0",
    documentation = "/scalar/",
    swagger = "/swagger",
    health = "/health"
}))
.WithName("Root")
.WithOpenApi();


// ============================================
// RUN APPLICATION
// ============================================
try
{
    Log.Information("Starting FinTech Payment API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

// ============================================
// SEED DEFAULT DATA
// ============================================
static void SeedDefaultData(FinTech.Data.AppDbContext db)
{
    if (!db.HelpArticles.Any())
    {
        db.HelpArticles.AddRange(new[]
        {
            new FinTech.Models.HelpArticle
            {
                Id = Guid.NewGuid(),
                Category = "Account",
                Question = "How do I reset my password?",
                Answer = "Go to Settings > Security > Change Password. Enter your current password and set a new one.",
                SortOrder = 1
            },
            new FinTech.Models.HelpArticle
            {
                Id = Guid.NewGuid(),
                Category = "Transfers",
                Question = "What are the transfer limits?",
                Answer = "Daily transfer limits are $10,000 for verified accounts. You can request higher limits through support.",
                SortOrder = 2
            },
            new FinTech.Models.HelpArticle
            {
                Id = Guid.NewGuid(),
                Category = "Transfers",
                Question = "How long do transfers take?",
                Answer = "Internal transfers are instant. Bank transfers typically take 1-3 business days.",
                SortOrder = 3
            },
            new FinTech.Models.HelpArticle
            {
                Id = Guid.NewGuid(),
                Category = "Cards",
                Question = "How do I add a new card?",
                Answer = "Navigate to Cards and select Add New Card, then follow the verification steps to link your card.",
                SortOrder = 4
            },
            new FinTech.Models.HelpArticle
            {
                Id = Guid.NewGuid(),
                Category = "Cards",
                Question = "Why was my card declined?",
                Answer = "Common reasons: insufficient funds, daily limit reached, or security freeze enabled. Check your card status under Cards.",
                SortOrder = 5
            },
            new FinTech.Models.HelpArticle
            {
                Id = Guid.NewGuid(),
                Category = "Transactions",
                Question = "How do I dispute a transaction?",
                Answer = "Open the transaction in your history and select Dispute Transaction, or contact support with the transaction reference.",
                SortOrder = 6
            }
        });

        db.SaveChanges();
        Log.Information("Seeded default help articles");
    }

    SeedUserDemoData(db);
}

// ============================================
// SEED DEMO DATA (dev only, per-user, per-piece)
// Fills gaps only — each category seeds when the user
// is missing it, so it is idempotent across restarts.
// ============================================
static void SeedUserDemoData(FinTech.Data.AppDbContext db)
{
    static FinTech.Models.Transaction Tx(Guid? from, Guid? to, decimal amount, string currency,
        TransactionType type, TransactionStatus status, string description, string reference, DateTime createdAt) =>
        new()
        {
            Id = Guid.NewGuid(),
            IdempotencyKey = Guid.NewGuid(),
            FromWalletId = from,
            ToWalletId = to,
            Amount = amount,
            Currency = currency,
            Type = type,
            Status = status,
            Description = description,
            ReferenceId = reference,
            CreatedAt = createdAt,
            CompletedAt = status == TransactionStatus.Completed ? createdAt.AddMinutes(2) : null
        };

    static FinTech.Models.InboxMessage Inbox(Guid userId, string from, string subject, string body,
        InboxMessageType type, bool isRead, DateTime createdAt) =>
        new()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            From = from,
            Subject = subject,
            Body = body,
            Type = type,
            IsRead = isRead,
            CreatedAt = createdAt
        };

    static FinTech.Models.Notification Notif(Guid userId, string title, string body,
        NotificationType type, bool isRead, DateTime createdAt) =>
        new()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Body = body,
            Type = type,
            IsRead = isRead,
            CreatedAt = createdAt
        };

    static FinTech.Models.SupportMessage SupportMsg(Guid? senderId, bool isFromUser, string body, DateTime createdAt) =>
        new()
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            IsFromUser = isFromUser,
            Body = body,
            CreatedAt = createdAt
        };

    var users = db.Users.Include(u => u.Wallets).ToList();
    if (users.Count == 0)
    {
        return;
    }

    var now = DateTime.UtcNow;

    foreach (var user in users)
    {
        var usdWallet = user.Wallets.FirstOrDefault(w => w.CurrencyCode == "USD");
        var eurWallet = user.Wallets.FirstOrDefault(w => w.CurrencyCode == "EUR");

        // 1. EUR wallet (second account)
        if (eurWallet == null)
        {
            eurWallet = new FinTech.Models.Wallet
            {
                UserId = user.Id,
                CurrencyCode = "EUR",
                Status = WalletStatus.Active
            };
            db.Wallets.Add(eurWallet);
            db.SaveChanges();
            Log.Information("Seeded EUR wallet for user {UserId}", user.Id);
        }

        var hasUsdTransactions = usdWallet != null && db.Transactions.Any(t =>
            t.FromWalletId == usdWallet.Id || t.ToWalletId == usdWallet.Id);
        var hasEurTransactions = eurWallet != null && db.Transactions.Any(t =>
            t.FromWalletId == eurWallet.Id || t.ToWalletId == eurWallet.Id);

        // 2. Transactions (balances are derived from completed transactions)
        if (usdWallet != null && !hasUsdTransactions)
        {
            db.Transactions.AddRange(new[]
            {
                Tx(usdWallet.Id, null, 2500.00m, "USD", TransactionType.Deposit, TransactionStatus.Completed,
                    "Deposit from Bank of America •• 4821", "TXN-DEP-8F21A", now.AddDays(-21)),
                Tx(usdWallet.Id, null, 200.00m, "USD", TransactionType.Deposit, TransactionStatus.Pending,
                    "Deposit from Debit Card •• 4521", "TXN-DEP-91C47", now.AddHours(-2)),
                Tx(null, usdWallet.Id, 160.50m, "USD", TransactionType.Transfer, TransactionStatus.Completed,
                    "Money received from Sarah Kim", "TXN-RCV-4B7D2", now.AddDays(-6)),
                Tx(null, usdWallet.Id, 500.00m, "USD", TransactionType.Refund, TransactionStatus.Completed,
                    "Refund — Order #28411 (Nordstrom)", "TXN-REF-3E9C1", now.AddDays(-12)),
                Tx(usdWallet.Id, null, 89.47m, "USD", TransactionType.Transfer, TransactionStatus.Completed,
                    "Whole Foods Market", "TXN-PAY-A11F8", now.AddDays(-2)),
                Tx(usdWallet.Id, null, 24.99m, "USD", TransactionType.Transfer, TransactionStatus.Completed,
                    "Netflix Subscription", "TXN-PAY-C33B0", now.AddDays(-5)),
                Tx(usdWallet.Id, null, 350.00m, "USD", TransactionType.Transfer, TransactionStatus.Completed,
                    "Transfer to James Park", "TXN-PAY-77E4D", now.AddDays(-9)),
                Tx(usdWallet.Id, null, 1200.00m, "USD", TransactionType.Transfer, TransactionStatus.Completed,
                    "Rent — Maple St Apartments", "TXN-PAY-2A91B", now.AddDays(-14)),
                Tx(usdWallet.Id, null, 45.00m, "USD", TransactionType.Transfer, TransactionStatus.Completed,
                    "T-Mobile Bill Payment", "TXN-PAY-B5C3E", now.AddDays(-18)),
                Tx(usdWallet.Id, null, 120.00m, "USD", TransactionType.Transfer, TransactionStatus.Failed,
                    "Amazon.com — card declined", "TXN-FAIL-6D8F0", now.AddDays(-1)),
                Tx(usdWallet.Id, null, 0.50m, "USD", TransactionType.Fee, TransactionStatus.Completed,
                    "Transfer fee", "TXN-FEE-1E2A3", now.AddDays(-9))
            });
        }

        if (eurWallet != null && !hasEurTransactions)
        {
            db.Transactions.AddRange(new[]
            {
                Tx(eurWallet.Id, null, 300.00m, "EUR", TransactionType.Deposit, TransactionStatus.Completed,
                    "SEPA Deposit — Deutsche Bank", "TXN-EUR-9F2C5", now.AddDays(-10)),
                Tx(eurWallet.Id, null, 45.60m, "EUR", TransactionType.Transfer, TransactionStatus.Completed,
                    "Café Central Vienna", "TXN-EUR-4A7E1", now.AddDays(-3))
            });
        }

        var holderName = $"{user.FirstName ?? "Demo"} {user.LastName ?? "User"}".Trim().ToUpperInvariant();

        // 3. Cards (encrypted fields are placeholders — API only returns last four digits)
        if (usdWallet != null && !db.Cards.Any(c => c.WalletId == usdWallet.Id))
        {
            db.Cards.AddRange(new[]
            {
                new FinTech.Models.Card
                {
                    WalletId = usdWallet.Id,
                    CardType = "Virtual",
                    CardNumber = "ENC:SEED-VIRT-4521",
                    LastFourDigits = "4521",
                    CardHolderName = holderName,
                    ExpiryMonth = "09",
                    ExpiryYear = "2029",
                    CVV = "ENC:SEED",
                    Status = CardStatus.Active,
                    SpendingLimit = 1000,
                    DailyLimit = 500,
                    MonthlyLimit = 5000
                },
                new FinTech.Models.Card
                {
                    WalletId = usdWallet.Id,
                    CardType = "Physical",
                    CardNumber = "ENC:SEED-PHYS-7720",
                    LastFourDigits = "7720",
                    CardHolderName = holderName,
                    ExpiryMonth = "03",
                    ExpiryYear = "2028",
                    CVV = "ENC:SEED",
                    Status = CardStatus.Frozen,
                    SpendingLimit = 2500,
                    DailyLimit = 1000,
                    MonthlyLimit = 10000
                }
            });
        }

        // 4. Inbox messages
        if (!db.InboxMessages.Any(m => m.UserId == user.Id))
        {
            db.InboxMessages.AddRange(new[]
            {
                Inbox(user.Id, "FinTech Statements", "Your August statement is ready",
                    "Your account statement for August 2026 is now available. Open the app to review your transactions, spending categories and monthly summary.",
                    InboxMessageType.Statement, true, now.AddDays(-3)),
                Inbox(user.Id, "FinTech Statements", "Your September statement is ready",
                    "Your account statement for September 2026 is now available, including a breakdown of your top spending categories.",
                    InboxMessageType.Statement, false, now.AddDays(-2)),
                Inbox(user.Id, "FinTech Security", "New sign-in from a new device",
                    "We noticed a sign-in to your account from Safari on Windows (Chrome, IP 104.28.x.x) on " + now.ToString("MMM d") + ". If this was you, no action is needed. If not, freeze your cards and contact support immediately.",
                    InboxMessageType.Security, false, now.AddDays(-1)),
                Inbox(user.Id, "FinTech Support", "Update on your support ticket",
                    "Good news — our team has an update on your card ticket. We've added a reply to the conversation; the decline was triggered by our fraud-prevention system. Check the thread for details.",
                    InboxMessageType.Support, false, now.AddHours(-3)),
                Inbox(user.Id, "FinTech Rewards", "Double points on dining this weekend",
                    "Earn 2x rewards points on all dining purchases from Friday to Sunday. No activation needed — points are credited automatically.",
                    InboxMessageType.Promotion, false, now.AddHours(-5)),
                Inbox(user.Id, "FinTech System", "Scheduled maintenance: Sunday 02:00–04:00 UTC",
                    "The app will be briefly unavailable on Sunday between 02:00 and 04:00 UTC for scheduled maintenance. Transfers are paused during this window.",
                    InboxMessageType.System, true, now.AddDays(-7))
            });
        }

        // 5. Notifications
        if (!db.Notifications.Any(n => n.UserId == user.Id))
        {
            db.Notifications.AddRange(new[]
            {
                Notif(user.Id, "Transfer completed", "$350.00 sent to James Park. Reference TXN-PAY-77E4D.",
                    NotificationType.Payment, true, now.AddDays(-9)),
                Notif(user.Id, "Deposit received", "$160.50 received from Sarah Kim.",
                    NotificationType.Payment, true, now.AddDays(-6)),
                Notif(user.Id, "New sign-in detected", "Sign-in from a new device on " + now.AddDays(-1).ToString("MMM d") + ". Review the activity under Security.",
                    NotificationType.Security, false, now.AddDays(-1)),
                Notif(user.Id, "Card frozen", "Your Physical card •• 7720 was frozen for security. Unfreeze it from Cards when you're ready.",
                    NotificationType.Card, false, now.AddHours(-4)),
                Notif(user.Id, "Bill payment due", "Your T-Mobile bill of $45.00 is due in 3 days.",
                    NotificationType.Bill, false, now.AddHours(-6)),
                Notif(user.Id, "App update available", "Version 2.4.1 is available — includes performance improvements and bug fixes.",
                    NotificationType.System, true, now.AddDays(-5))
            });
        }

        // 6. Support tickets with threads
        if (!db.SupportTickets.Any(t => t.UserId == user.Id))
        {
            var openTicket = new FinTech.Models.SupportTicket
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Category = "Cards",
                Subject = "Card declined at Amazon",
                Description = "My virtual card was declined when I tried to place an order on Amazon. The order was for $120 and I have enough balance. Can you look into it?",
                Status = SupportTicketStatus.Open,
                CreatedAt = now.AddDays(-1),
                UpdatedAt = now.AddHours(-1),
                Messages =
                {
                    SupportMsg(user.Id, true,
                        "My virtual card was declined when I tried to place an order on Amazon. The order was for $120 and I have enough balance. Can you look into it?",
                        now.AddDays(-1)),
                    SupportMsg(null, false,
                        "Hi, thanks for reaching out. We can see the decline attempt — the transaction was flagged by our fraud-prevention system because the merchant country didn't match your usual region. Could you confirm the order was placed from your home in the US?",
                        now.AddDays(-1).AddHours(-4)),
                    SupportMsg(user.Id, true,
                        "Yes, it was placed from my home in the US. I tried again and it went through this time, so no rush — but please confirm there's nothing wrong with the card.",
                        now.AddHours(-1))
                }
            };

            var progressTicket = new FinTech.Models.SupportTicket
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Category = "Account",
                Subject = "Update my phone number",
                Description = "I got a new phone number and can't find where to update it in the app. The settings page only shows my email. Could you update it for me?",
                Status = SupportTicketStatus.InProgress,
                CreatedAt = now.AddDays(-3),
                UpdatedAt = now.AddDays(-1),
                Messages =
                {
                    SupportMsg(user.Id, true,
                        "I got a new phone number and can't find where to update it in the app. The settings page only shows my email. Could you update it for me?",
                        now.AddDays(-3)),
                    SupportMsg(null, false,
                        "We can help with that. For security, please confirm the last two digits of your current number and we'll send a verification code to your new number.",
                        now.AddDays(-1))
                }
            };

            var resolvedTicket = new FinTech.Models.SupportTicket
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Category = "Transfers",
                Subject = "Transfer not showing in recipient account",
                Description = "I sent $350 to James Park on the 7th and he says it hasn't arrived. The app shows it as completed.",
                Status = SupportTicketStatus.Resolved,
                CreatedAt = now.AddDays(-12),
                UpdatedAt = now.AddDays(-8),
                Messages =
                {
                    SupportMsg(user.Id, true,
                        "I sent $350 to James Park on the 7th and he says it hasn't arrived. The app shows it as completed.",
                        now.AddDays(-12)),
                    SupportMsg(null, false,
                        "We checked the transfer — it was delivered to James's FinTech wallet on the same day. Could you ask him to check his transaction history, or confirm the email/phone we matched on the recipient lookup?",
                        now.AddDays(-11)),
                    SupportMsg(user.Id, true,
                        "He found it — it landed in his second wallet (EUR). Sorry for the confusion!",
                        now.AddDays(-10)),
                    SupportMsg(null, false,
                        "Great news! Marking this ticket as resolved. Don't hesitate to reach out if anything else comes up.",
                        now.AddDays(-8))
                }
            };

            db.SupportTickets.AddRange(new[] { openTicket, progressTicket, resolvedTicket });
        }
    }

    db.SaveChanges();
    Log.Information("Seeded demo data for {UserCount} user(s)", users.Count);
}

// ============================================
// HANGFIRE AUTHORIZATION FILTER
// ============================================
public class HangfireAuthorizationFilter : Hangfire.Dashboard.IDashboardAuthorizationFilter
{
    private readonly IWebHostEnvironment _environment;

    public HangfireAuthorizationFilter(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public bool Authorize(Hangfire.Dashboard.DashboardContext context)
    {
        // Allow all in development
        if (_environment.IsDevelopment())
        {
            return true;
        }

        // In production, require authentication and Admin role
        var httpContext = context.GetHttpContext();
        return httpContext.User.Identity?.IsAuthenticated == true && httpContext.User.IsInRole("Admin");
    }
}