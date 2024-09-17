using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using ResortRecommendationGenerator.Core.Services.Implementations;

namespace ResortRecomendationGenerator.Web
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddRazorPages();

            // Register database context through dependency injection
            builder.Services.AddDbContext<Context>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
                
                if (builder.Environment.IsDevelopment())
                    options.EnableSensitiveDataLogging();
            });

            // Register encryption service through dependency injection
            builder.Services.AddScoped<ISecurity, Security>();

            var app = builder.Build();
            
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapRazorPages();

            app.Run();
        }
    }
}
