using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using FinTech.Data;
using FinTech.Models;
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