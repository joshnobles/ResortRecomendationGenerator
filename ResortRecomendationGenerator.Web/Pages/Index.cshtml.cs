using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Services.Interfaces;

namespace ResortRecomendationGenerator.Web.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IAccountRepository _accountRepo;

        public IndexModel(IAccountRepository accountRepo)
        {
            _accountRepo = accountRepo;
        }

        [BindProperty]
        public LoginViewModel ViewModel { get; set; } = new();

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
