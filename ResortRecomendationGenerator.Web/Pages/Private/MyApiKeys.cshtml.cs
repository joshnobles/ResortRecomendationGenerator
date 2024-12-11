using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using ResortRecommendationGenerator.Core.Services.Static;

namespace ResortRecomendationGenerator.Web.Pages.Private
{
    public class MyApiKeysModel : PageModel
    {
        private readonly IApiKeyRepository _apiKeyRepo;
        private readonly IAccountRepository _accountRepo;

        public MyApiKeysModel(IApiKeyRepository apiKeyRepo, IAccountRepository accountRepo) 
        {
            _apiKeyRepo = apiKeyRepo;
            _accountRepo = accountRepo;
        }

        public IActionResult OnGet()
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            return Page();
        }

        public async Task<IActionResult> OnGetAccountKeys(CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            return new JsonResult(await _apiKeyRepo.GetAccountKeysAsync(idAccount, token));
        }

        public async Task<IActionResult> OnGetApiKey([FromQuery] int idApiKey, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            Account currentAccount;

            try
            {
                currentAccount = await _accountRepo.GetAccountByIdAsync(idAccount, token);
            }
            catch (AccountNotFoundException)
            {
                return Redirect("/Logout");
            }

            ApiKey apiKey;

            try
            {
                apiKey = await _apiKeyRepo.GetApiKeyByIdAsync(idApiKey, token);

                if (!currentAccount.IsAdmin)
                {
                    if (apiKey.IdAccount != currentAccount.IdAccount)
                        return Unauthorized();
                }
            }
            catch (ApiKeyNotFoundException)
            {
                return NotFound();
            }

            return new JsonResult(apiKey);
        }

        public async Task<IActionResult> OnPostRegisterApiKey([FromBody] AddApiKeyViewModel viewModel, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            try
            {
                await _apiKeyRepo.AddKeyAsync(idAccount, viewModel.Name, viewModel.AllowedHost, token);

                return new EmptyResult();
            }
            catch (TooManyApiKeysException)
            {
                return new ConflictResult();
            }
        }

        public async Task<IActionResult> OnPutEditApiKey([FromBody] EditApiKeyViewModel viewModel, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            try
            {
                await _apiKeyRepo.UpdateKeyAsync(viewModel.IdApiKey, viewModel.Name, viewModel.AllowedHost, token);
            }
            catch (ApiKeyNotFoundException)
            {
                return NotFound();
            }

            return new EmptyResult();
        }

        public async Task<IActionResult> OnDeleteApiKey([FromQuery] int idApiKey, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            try
            {
                await _apiKeyRepo.DeleteKeyAsync(idApiKey, token);
            }
            catch (ApiKeyNotFoundException)
            {
                return NotFound();
            }

            return new EmptyResult();
        }

        public IActionResult OnGetIdAccount()
        {
            if (!CheckSession(out int idAccount))
                return Unauthorized();

            return new JsonResult(idAccount);
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
