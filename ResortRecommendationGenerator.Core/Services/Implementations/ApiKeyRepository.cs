using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Exceptions;
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

        public async Task<bool> TryValidateKeyAsync(string key, bool adminOnly, CancellationToken token)
        {
            var encKey = await _security.EncryptAsync(key);

            var validApiKey = await _context.ApiKey.FirstOrDefaultAsync(k => k.Value.SequenceEqual(encKey), token);

            if (validApiKey is null)
                return false;

            var idAccount = validApiKey.IdAccount;

            if (!adminOnly)
                return true;

            try
            {
                var account = await _accountRepo.GetAccountByIdAsync(idAccount, token);

                if (!account.IsAdmin)
                    return false;

                return true;
            }
            catch (AccountNotFoundException)
            {
                return false;
            }
        }

        public async Task AddKeyAsync(int idAccount, CancellationToken token)
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

            var newApiKey = new EncryptedApiKey()
            {
                IdAccount = idAccount,
                Value = encNewKey
            };

            await _context.ApiKey.AddAsync(newApiKey, CancellationToken.None);
            await _context.SaveChangesAsync(CancellationToken.None);
        }
    }
}
