using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Services.Interfaces;

namespace ResortRecomendationGenerator.Web.Pages
{
    public class RegisterModel : PageModel
    {
        private readonly IAccountRepository _accountRepo;

        public RegisterModel(IAccountRepository accountRepo)
        {
            _accountRepo = accountRepo;
        }

        [BindProperty]
        public RegisterViewModel ViewModel { get; set; } = new();

        public async Task<IActionResult> OnPostRegister(CancellationToken token = default)
        {
            if (!ModelState.IsValid)
                return Page();

            ViewModel.TrimValues();

            if (await _accountRepo.AccountExistsAsync(ViewModel.Email, token))
                return Page();

            try
            {
                var idAccount = await _accountRepo.AddAccountAsync(ViewModel.Email, ViewModel.Password, ViewModel.FirstName, ViewModel.LastName, false, token);

                HttpContext.Session.SetInt32("IdAccount", idAccount);
                HttpContext.Session.SetInt32("IsAdmin", 0);

                return Redirect("/Private/Welcome");
            }
            catch (AccountEmailTakenException)
            {
                return Page();
            }
        }
    }
}
