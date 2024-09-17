using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.Models.EncryptedModels;

namespace ResortRecommendationGenerator.Core.DataAccess
{
    public class Context : DbContext
    {
        public Context(DbContextOptions options) : base(options) { }


        public DbSet<EncryptedAccount> Account { get; set; }
    }
}