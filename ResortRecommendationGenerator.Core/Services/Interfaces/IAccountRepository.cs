using ResortRecommendationGenerator.Core.Models.DecryptedModels;

namespace ResortRecommendationGenerator.Core.Services.Interfaces
{
    public interface IAccountRepository
    {
        public Task<Account> GetAccountByIdAsync(int idAccount, CancellationToken token);

        public Task<Account> LoginAccountAsync(string email, string password, CancellationToken token);

        public Task<bool> AccountExistsAsync(string email, string phone, CancellationToken token);

        public Task<int> AddAccountAsync(string email, string phone, string password, string firstName, string lastName, bool isAdmin, CancellationToken token);
    }
}
