namespace ResortRecommendationGenerator.Core.Services.Interfaces
{
    public interface IApiKeyRepository
    {
        public Task<bool> TryValidateKeyAsync(string key, bool adminOnly, CancellationToken token);

        public Task AddKeyAsync(int idAccount, CancellationToken token);
    }
}
