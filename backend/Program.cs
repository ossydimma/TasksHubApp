using System.Text;
using Hangfire;
using Hangfire.PostgreSql;
using HangfireBasicAuthenticationFilter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TasksHubServer.Data;
using TasksHubServer.Repositories;
using TasksHubServer.Services;
using StackExchange.Redis;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.DataProtection;

var builder = WebApplication.CreateBuilder(args);

// Get and add the connection strings
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new NullReferenceException("Connection string 'default' not found in configuration");
string? hangfireUser = builder.Configuration.GetSection("HangfireSettings:User").Value;
string? hangfirePass = builder.Configuration.GetSection("HangfireSettings:Pass").Value;
var redisHost = builder.Configuration["REDIS_HOST"];
var redisPassword = builder.Configuration["REDIS_PASSWORD"];

// --- Configure Hangfire Services ---
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options =>
    {
        options.UseNpgsqlConnection(connectionString);
    }, new PostgreSqlStorageOptions
    {
        InvisibilityTimeout = TimeSpan.FromMinutes(5),
        QueuePollInterval = TimeSpan.FromSeconds(3),
        DistributedLockTimeout = TimeSpan.FromMinutes(10),
        PrepareSchemaIfNecessary = true,
        SchemaName = "hangfire"
    }));

// Add the processing server as IHostedService
builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = 5; // Limits concurrent database connections
});

// --- Configure EF Core for PostgreSQL ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add Redis services to the container.
var redisConfigOptions = new ConfigurationOptions
{
    EndPoints = { redisHost! },
    Password = redisPassword,
    Ssl = true, // MANDATORY for rediss://
    AbortOnConnectFail = false,
    ConnectTimeout = 15000,
    SyncTimeout = 15000
};

IConnectionMultiplexer? multiplexer = null;

try
{
    multiplexer = ConnectionMultiplexer.Connect(redisConfigOptions);

    builder.Services.AddSingleton<IConnectionMultiplexer>(multiplexer);

    builder.Services.AddDataProtection()
        .SetApplicationName("TasksHubApp")
        .PersistKeysToStackExchangeRedis(multiplexer, "DataProtection-Keys");

    Console.WriteLine("✅ Connected to Redis successfully");
}
catch (Exception ex)
{
    // Log the error but allow the application to start
    Console.WriteLine($"❌ Failed to connect to Redis: {ex.Message}");
}

builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IDocumentRepo, DocumentRepo>();
builder.Services.AddScoped<ITaskRepo, TaskRepo>();
builder.Services.AddSingleton<OTPService>();
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddScoped<TaskMaintenanceService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://tasks-hub-app.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
    });

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

// Register the Health Check service
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    DashboardTitle = "TasksHub Jobs",
    Authorization = new[]
    {
        new HangfireCustomBasicAuthenticationFilter
        {
            User = hangfireUser,
            Pass = hangfirePass
        }
    }
});

RecurringJob.AddOrUpdate<TaskMaintenanceService>(
    "UpdateOverdueTasksJob",
    service => service.UpdateOverdueTasksAsync(),
    Cron.Daily(1, 0),
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.Utc,
    }
);

// Essential for Render/Docker deployments
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.MapHealthChecks("/healthz");

app.Run();
