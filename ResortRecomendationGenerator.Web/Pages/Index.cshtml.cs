using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Services.Interfaces;

namespace ResortRecomendationGenerator.Web.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IAccountRepository _accountRepo;
        private readonly Context _context;
        private readonly ISecurity _sec;

        public IndexModel(IAccountRepository accountRepo, Context context, ISecurity sec)
        {
            _accountRepo = accountRepo;
            _context = context;
            _sec = sec;
        }

        [BindProperty]
        public LoginViewModel ViewModel { get; set; } = new();

        public async Task OnGet()
        {
            var key = await _context.ApiKey.FirstOrDefaultAsync(k => k.IdAccount == 1);

            var text = await _sec.DecryptAsync(key.Value);

            var enc = await _sec.EncryptAsync(text);

            var newText = await _sec.DecryptAsync(enc);

            Console.WriteLine(text);
            Console.WriteLine(newText);
        }

        public async Task<IActionResult> OnPostLogin(CancellationToken token = default)
        {
            if (!ModelState.IsValid || ViewModel.Email is null || ViewModel.Password is null)
                return Page();

            ViewModel.TrimValues();

            try
            {
                var account = await _accountRepo.LoginAccountAsync(ViewModel.Email, ViewModel.Password, token);

                HttpContext.Session.SetInt32("IdAccount", account.IdAccount);
                HttpContext.Session.SetInt32("IsAdmin", account.IsAdmin ? 1 : 0);

                if (account.IsAdmin)
                    return Redirect("/Private/Admin/Dashboard");

                return Redirect("/Private/Welcome");
            }
            catch (AccountNotFoundException)
            {
                return Page();
            }
        }
    }
}
