using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Models.EncryptedModels;

namespace ResortRecommendationGenerator.Core.DataAccess
{
    public class Context : DbContext
    {
        public Context(DbContextOptions options) : base(options) { }


        public DbSet<EncryptedAccount> Account { get; set; }
        public DbSet<EncryptedApiKey> ApiKey { get; set; }
        public DbSet<SkiResort> SkiResort { get; set; }
        public DbSet<PotentialSkiResort> PotentialSkiResort { get; set; }
    }
}