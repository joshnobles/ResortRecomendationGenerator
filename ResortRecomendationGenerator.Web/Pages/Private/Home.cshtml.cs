using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Services.Interfaces;

namespace ResortRecomendationGenerator.Web.Pages.Private
{
    public class HomeModel : PageModel
    {
        private readonly IAccountRepository _accountRepo;

        public HomeModel(IAccountRepository accountRepo)
        {
            _accountRepo = accountRepo;
        }

        public Account CurrentAccount { get; set; } = new();

        public async Task<IActionResult> OnGet(CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Index");

            try
            {
                CurrentAccount = await _accountRepo.GetAccountByIdAsync(idAccount, token);
            }
            catch (AccountNotFoundException)
            {
                return Redirect("/Index");
            }

            return Page();
        }

        private bool CheckSession(out int idAccount)
        {
            var id = HttpContext.Session.GetInt32("IdAccount");

            if (id is null)
            {
                idAccount = 0;
                return false;
            }

            idAccount = (int)id;
            return true;
        }
    }
}
