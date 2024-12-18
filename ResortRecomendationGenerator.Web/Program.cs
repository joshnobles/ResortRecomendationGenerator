using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using ResortRecommendationGenerator.Core.Services.Implementations;
using System.Security.Cryptography;
using ResortRecomendationGenerator.Web.Twilio;

namespace ResortRecomendationGenerator.Web
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddRazorPages();

            // Add API controllers
            builder.Services.AddControllers();

            // Register database context through dependency injection
            builder.Services.AddDbContext<Context>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Production"));
                //if (builder.Environment.IsDevelopment())
                //{
                //    options.UseSqlServer(builder.Configuration.GetConnectionString("Development"));
                //    options.EnableSensitiveDataLogging();
                //}
                //else
                //    options.UseSqlServer(builder.Configuration.GetConnectionString("Production"));
            });

            // Register encryption service through dependency injection
            builder.Services.AddScoped<ISecurity, Security>(service => 
                new Security
                (
                    builder.Configuration.GetSection("Security").GetValue<string>("Key") ?? "",
                    builder.Configuration.GetSection("Security").GetValue<string>("Iv") ?? ""
                )
            );

            // Register account repository through dependency injection
            builder.Services.AddScoped<IAccountRepository, AccountRepository>();
            
            // Register API key repository through dependency injection
            builder.Services.AddScoped<IApiKeyRepository, ApiKeyRepository>();

            // Register Twilio verification service through dependency injection
            builder.Services.AddScoped<ITwilioService, TwilioService>(service =>
                new TwilioService
                (
                    builder.Configuration.GetSection("Twilio").GetValue<string>("AccountSid") ?? "",
                    builder.Configuration.GetSection("Twilio").GetValue<string>("AuthToken") ?? "",
                    builder.Configuration.GetSection("Twilio").GetValue<string>("PathServiceSid") ?? ""
                )
            );

            // Add session varaibles to the application
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(10);
            });

            var app = builder.Build();

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseSession();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            // Map routes to api endpoints
            app.MapControllers();

            // Map routes to razor views
            app.MapRazorPages();

            app.Run();
        }
    }
}
