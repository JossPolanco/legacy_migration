using Microsoft.EntityFrameworkCore;
using Template_API.Models;
using Template_API.Services;
using Template_API.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<ProjectTemplateScharpContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ProjectTemplateConnection")));

builder.Services.AddScoped<IUsersService, UsersService>();

// Configure OpenAPI (native to .NET 10)
builder.Services.AddOpenApi();

var app = builder.Build();

// REACT
app.UseDefaultFiles();   // Search index.html
app.UseStaticFiles();    // Load wwwroot

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// app.MapFallbackToFile("index.html");

app.Run();
