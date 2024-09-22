using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Models.EncryptedModels;
using ResortRecommendationGenerator.Core.Services.Interfaces;

namespace ResortRecommendationGenerator.Core.Services.Implementations
{
    public class AccountRepository : IAccountRepository
    {
        private readonly Context _context;
        private readonly ISecurity _security;

        public AccountRepository(Context context, ISecurity security)
        {
            _context = context;
            _security = security;
        }


        public async Task<bool> AccountExistsAsync(string email, CancellationToken token)
        {
            var encEmail = await _security.EncryptAsync(email);

            return await _context.Account
                .AnyAsync(a => a.Email.SequenceEqual(encEmail), token);
        }

        public async Task<Account> GetAccountByIdAsync(int idAccount, CancellationToken token)
        {
            var encAccount = await _context.Account.FirstOrDefaultAsync(a => a.IdAccount == idAccount, token);

            if (encAccount is null)
                throw new AccountNotFoundException();

            return new Account()
            {
                IdAccount = encAccount.IdAccount,
                FirstName = await _security.DecryptAsync(encAccount.FirstName),
                LastName = await _security.DecryptAsync(encAccount.LastName),
                Email = await _security.DecryptAsync(encAccount.Email),
                IsAdmin = encAccount.IsAdmin
            };
        }

        public async Task<Account> LoginAccountAsync(string email, string password, CancellationToken token)
        {
            var encEmail = await _security.EncryptAsync(email);
            var hashPassword = await _security.HashAsync(password);

            var encAccount = await _context.Account
                .FirstOrDefaultAsync(a => a.Email.SequenceEqual(encEmail) && a.Password.SequenceEqual(hashPassword), token);

            if (encAccount is null)
                throw new AccountNotFoundException();

            return new Account()
            {
                IdAccount = encAccount.IdAccount,
                FirstName = await _security.DecryptAsync(encAccount.FirstName),
                LastName = await _security.DecryptAsync(encAccount.LastName),
                Email = await _security.DecryptAsync(encAccount.Email),
                IsAdmin = encAccount.IsAdmin
            };
        }

        public async Task<int> AddAccountAsync(string email, string password, string firstName, string lastName, bool isAdmin, CancellationToken token)
        {
            var encEmail = await _security.EncryptAsync(email);
            var hashPassword = await _security.HashAsync(password);
            var encFirstName = await _security.EncryptAsync(firstName);
            var encLastName = await _security.EncryptAsync(lastName);

            if (await _context.Account.AnyAsync(a => a.Email.SequenceEqual(encEmail), token))
                throw new AccountEmailTakenException();

            var encAccount = new EncryptedAccount()
            {
                FirstName = encFirstName,
                LastName = encLastName,
                Email = encEmail,
                Password = hashPassword,
                IsAdmin = isAdmin
            };

            await _context.Account.AddAsync(encAccount, CancellationToken.None);
            await _context.SaveChangesAsync(CancellationToken.None);

            return encAccount.IdAccount;
        }
    }
}
