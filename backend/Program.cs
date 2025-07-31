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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Get the PostgreSQL connection string
var hangfireConnStr = builder.Configuration.GetConnectionString("HangfireConnection");

// Get and add the connection strings
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new NullReferenceException("Connection string 'default' not found in configuration");
string? hangfireUser = builder.Configuration.GetSection("HangfireSettings:User").Value;
string? hangfirePass = builder.Configuration.GetSection("HangfireSettings:Pass").Value;

Console.WriteLine($"Hangfire configured user: '{hangfireUser}'");
Console.WriteLine($"Hangfire configured pass: '{hangfirePass}'");

// --- Configure Hangfire Services ---
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options => // <--- CHANGE THIS LINE
    {
        options.UseNpgsqlConnection(hangfireConnStr); 
    }));

// Add the processing server as IHostedService
builder.Services.AddHangfireServer();

builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(connectionString));

// Add Redis services to the container.
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("RedisConnections");
    options.InstanceName = "SampleDb";
});

Console.WriteLine(builder.Configuration.GetConnectionString("RedisConnections"));

builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IDocumentRepo, DocumentRepo>();
builder.Services.AddScoped<ITaskRepo, TaskRepo>();
builder.Services.AddSingleton<OTPService>();
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddScoped<TaskMaintenanceService>();


//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAllOrigins", policyBuilder =>
//    {
//        policyBuilder.AllowAnyOrigin()
//            .AllowAnyMethod()
//            .AllowAnyHeader();
//    });
//});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
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

var serviceProvider = app.Services.CreateScope().ServiceProvider;
var taskMaintenanceService = serviceProvider.GetRequiredService<TaskMaintenanceService>();

RecurringJob.AddOrUpdate(
    "UpdateOverdueTasksJob",
    () => taskMaintenanceService.UpdateOverdueTasksAsync(),
    Cron.Daily(1, 0),
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.Utc,
        // Queue = "default" // optional, can be omitted if you're not using custom queues
    }
);
app.Run();
