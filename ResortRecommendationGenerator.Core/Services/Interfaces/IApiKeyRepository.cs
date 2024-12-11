using ResortRecommendationGenerator.Core.Models.DecryptedModels;

namespace ResortRecommendationGenerator.Core.Services.Interfaces
{
    public interface IApiKeyRepository
    {
        public Task<bool> TryValidateKeyAsync(string key, string host, bool adminOnly, CancellationToken token);

        public Task<List<ApiKey>> GetAccountKeysAsync(int idAccount, CancellationToken token);

        public Task<ApiKey> GetApiKeyByIdAsync(int idApiKey, CancellationToken token);

        public Task AddKeyAsync(int idAccount, string name, string? allowedHost, CancellationToken token);

        public Task UpdateKeyAsync(int idApiKey, string name, string? allowedHost, CancellationToken token);

        public Task DeleteKeyAsync(int idApiKey, CancellationToken token);
    }
}
