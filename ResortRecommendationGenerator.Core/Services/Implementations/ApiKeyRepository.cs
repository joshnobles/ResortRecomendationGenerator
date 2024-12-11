using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Models.EncryptedModels;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using System.Security.Cryptography;

namespace ResortRecommendationGenerator.Core.Services.Implementations
{
    public class ApiKeyRepository : IApiKeyRepository
    {
        private readonly Context _context;
        private readonly ISecurity _security;
        private readonly IAccountRepository _accountRepo;

        public ApiKeyRepository(Context context, ISecurity security, IAccountRepository accountRepo)
        {
            _context = context;
            _security = security;
            _accountRepo = accountRepo;
        }

        private string GenerateKey()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);

            string base64String = Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_");

            return base64String[..32];
        }

        public async Task<bool> TryValidateKeyAsync(string key, string host, bool adminOnly, CancellationToken token)
        {
            var encKey = await _security.EncryptAsync(key);

            var validApiKey = await _context.ApiKey.FirstOrDefaultAsync(k => k.Value.SequenceEqual(encKey), token);

            if (validApiKey is null)
                return false;

            if (validApiKey.AllowedHost is not null)
            {
                var encHost = await _security.EncryptAsync(host);

                if (!validApiKey.AllowedHost.SequenceEqual(encHost))
                    return false;
            }

            if (!adminOnly)
                return true;

            try
            {
                var account = await _accountRepo.GetAccountByIdAsync(validApiKey.IdAccount, token);

                if (!account.IsAdmin)
                    return false;

                return true;
            }
            catch (AccountNotFoundException)
            {
                return false;
            }
        }

        public async Task<ApiKey> GetApiKeyByIdAsync(int idApiKey, CancellationToken token)
        {
            var encApiKey = await _context.ApiKey.FirstOrDefaultAsync(k => k.IdApiKey == idApiKey, token);

            if (encApiKey is null)
                throw new ApiKeyNotFoundException();

            var apiKey = new ApiKey()
            {
                IdApiKey = encApiKey.IdApiKey,
                IdAccount = encApiKey.IdAccount,
                Name = await _security.DecryptAsync(encApiKey.Name),
                Value = await _security.DecryptAsync(encApiKey.Value),
                AllowedHost = encApiKey.AllowedHost is null ? null : await _security.DecryptAsync(encApiKey.AllowedHost)
            };

            return apiKey;
        }

        public async Task<List<ApiKey>> GetAccountKeysAsync(int idAccount, CancellationToken token)
        {
            var encResult = await _context.ApiKey
                .Where(a => a.IdAccount == idAccount)
                .ToListAsync(token);

            List<ApiKey> result = [];

            foreach (var key in encResult)
            {
                result.Add(new()
                {
                    IdApiKey = key.IdApiKey,
                    IdAccount = key.IdAccount,
                    Name = await _security.DecryptAsync(key.Name),
                    Value = await _security.DecryptAsync(key.Value),
                    AllowedHost = key.AllowedHost is null ? null : await _security.DecryptAsync(key.AllowedHost)
                });
            }

            return result;
        }

        public async Task AddKeyAsync(int idAccount, string name, string? allowedHost, CancellationToken token)
        {
            if (await _context.ApiKey.CountAsync(k => k.IdAccount == idAccount, token) >= 3)
                throw new TooManyApiKeysException();

            string newKey;
            byte[] encNewKey;

            do
            {
                newKey = GenerateKey();

                encNewKey = await _security.EncryptAsync(newKey);
            }
            while (await _context.ApiKey.AnyAsync(k => k.Value.SequenceEqual(encNewKey), token));

            byte[]? encAllowedHost = allowedHost is not null ? await _security.EncryptAsync(allowedHost) : null;

            var newApiKey = new EncryptedApiKey()
            {
                IdAccount = idAccount,
                Name = await _security.EncryptAsync(name),
                Value = encNewKey,
                AllowedHost = encAllowedHost
            };

            await _context.ApiKey.AddAsync(newApiKey, CancellationToken.None);
            await _context.SaveChangesAsync(CancellationToken.None);
        }

        public async Task UpdateKeyAsync(int idApiKey, string name, string? allowedHost, CancellationToken token)
        {
            var encKey = await _context.ApiKey
                .FirstOrDefaultAsync(a => a.IdApiKey == idApiKey, token);

            if (encKey is null)
                throw new ApiKeyNotFoundException();

            encKey.Name = await _security.EncryptAsync(name);
            encKey.AllowedHost = allowedHost is null ? null : await _security.EncryptAsync(allowedHost);

            await _context.SaveChangesAsync(CancellationToken.None);
        }

        public async Task DeleteKeyAsync(int idApiKey, CancellationToken token)
        {
            var keyToDelete = await _context.ApiKey
                .FirstOrDefaultAsync(k => k.IdApiKey == idApiKey, token);

            if (keyToDelete is null)
                throw new ApiKeyNotFoundException();

            _context.ApiKey.Remove(keyToDelete);
            await _context.SaveChangesAsync(CancellationToken.None);
        }
    }
}
