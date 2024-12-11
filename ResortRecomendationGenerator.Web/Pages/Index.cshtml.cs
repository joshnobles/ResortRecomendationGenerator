using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using Twilio.Rest.Verify.V2.Service;
using Twilio;
using System.Threading.Channels;
using ResortRecomendationGenerator.Web.Twilio;
using ResortRecommendationGenerator.Core.DataAccess;
using Microsoft.EntityFrameworkCore;
using ResortRecommendationGenerator.Core.Services.Static;
using Twilio.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;

namespace ResortRecomendationGenerator.Web.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IAccountRepository _accountRepo;
        private readonly ITwilioService _twilio;

        public IndexModel(IAccountRepository accountRepo, ITwilioService twilio)
        {
            _accountRepo = accountRepo;
            _twilio = twilio;
        }

        public async Task<IActionResult> OnPostLogin([FromBody] LoginViewModel viewModel, CancellationToken token = default)
        {
            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            try
            {
                var account = await _accountRepo.LoginAccountAsync(viewModel.Email, viewModel.Password, token);

                await _twilio.SendVerificationCodeAsync(account.Phone);

                return new JsonResult(new 
                { 
                    phoneLast4 = account.Phone[6..], 
                    idAccount = account.IdAccount 
                });
            }
            catch (AccountNotFoundException)
            {
                return Unauthorized();
            }
            catch (ApiException e)
            {
                return Redirect(e.MoreInfo);
                // return new ConflictResult();
            }
        }

        public async Task<IActionResult> OnPostCheckOtp([FromBody] OtpViewModel viewModel, CancellationToken token = default)
        {
            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            try
            {
                var account = await _accountRepo.GetAccountByIdAsync(viewModel.IdAccount, token);

                var checkStatus = await _twilio.CheckVerificationCodeAsync(account.Phone, viewModel.Otp);

                if (checkStatus == "approved")
                {
                    HttpContext.Session.SetInt32("IdAccount", account.IdAccount);
                    HttpContext.Session.SetInt32("IsAdmin", account.IsAdmin ? 1 : 0);

                    if (account.IsAdmin)
                        return Redirect("/Private/Admin/Dashboard");
                    else
                        return Redirect("/Private/Home");
                }
                else if (checkStatus == "pending")
                    return new EmptyResult();
                else
                    return Unauthorized();
            }
            catch (AccountNotFoundException)
            {
                return NotFound();
            }
            catch (ApiException)
            {
                return Unauthorized();
            }
        }
    }
}
