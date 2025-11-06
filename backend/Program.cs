using System.Text;
using Hangfire;
using Hangfire.SqlServer;
using HangfireBasicAuthenticationFilter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TasksHubServer.Data;
using TasksHubServer.Repositories;
using TasksHubServer.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Get the PostgreSQL connection string
// var hangfireConnStr = builder.Configuration.GetConnectionString("HangfireConnection");

// Get and add the connection strings
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new NullReferenceException("Connection string 'default' not found in configuration");
string? hangfireUser = builder.Configuration.GetSection("HangfireSettings:User").Value;
string? hangfirePass = builder.Configuration.GetSection("HangfireSettings:Pass").Value;

// --- Configure Hangfire Services ---
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
    {
        CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
        SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
        QueuePollInterval = TimeSpan.Zero,
        UseRecommendedIsolationLevel = true,
        DisableGlobalLocks = true
    }));

// Add the processing server as IHostedService
builder.Services.AddHangfireServer();

Action<DbContextOptionsBuilder> dbContextOptionsBuilder = options => 
{
    options.UseSqlServer(connectionString);
};

builder.Services.AddDbContext<ApplicationDbContext>(dbContextOptionsBuilder);

// builder.Services.AddDbContextFactory<ApplicationDbContext>(dbContextOptionsBuilder);

// Add Redis services to the container.
var redisConfigOptions = new ConfigurationOptions
{
    EndPoints = { "massive-ocelot-8368.upstash.io:6379" }, 
    Password = "ASCwAAImcDJhZWExMjVjNTBjZTU0MDVlOWJmM2FkNmEyYWEwMTg0YnAyODM2OA",
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
        policy.WithOrigins("http://localhost:3000", "http://10.10.8.21:3000")
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
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // app.MapOpenApi();
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

// var serviceProvider = app.Services.CreateScope().ServiceProvider;
// var taskMaintenanceService = serviceProvider.GetRequiredService<TaskMaintenanceService>();

RecurringJob.AddOrUpdate<TaskMaintenanceService>(
    "UpdateOverdueTasksJob",
    service => service.UpdateOverdueTasksAsync(),
    Cron.Daily(1, 0),
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.Utc,
        // Queue = "default" // optional, can be omitted if you're not using custom queues
    }
);
app.Run();
