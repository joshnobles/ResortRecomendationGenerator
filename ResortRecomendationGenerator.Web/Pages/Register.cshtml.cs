using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ResortRecomendationGenerator.Web.Twilio;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using ResortRecommendationGenerator.Core.Services.Static;
using Twilio.Exceptions;

namespace ResortRecomendationGenerator.Web.Pages
{
    public class RegisterModel : PageModel
    {
        private readonly IAccountRepository _accountRepo;
        private readonly ITwilioService _twilio;

        public RegisterModel(IAccountRepository accountRepo, ITwilioService twilio)
        {
            _accountRepo = accountRepo;
            _twilio = twilio;
        }

        public async Task<IActionResult> OnPostVerifyPhone([FromBody] RegisterViewModel viewModel, CancellationToken token = default)
        {
            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            viewModel.TrimValues();

            if (await _accountRepo.AccountExistsAsync(viewModel.Email, viewModel.Phone, token))
                return new ConflictResult();

            try
            {
                await _twilio.SendVerificationCodeAsync(viewModel.Phone);

                return new EmptyResult();
            }
            finally { }
            //catch (ApiException)
            //{
            //    return Unauthorized();
            //}
        }

        public async Task<IActionResult> OnPostCheckOtp([FromBody] RegisterViewModel viewModel, [FromQuery] string otp, CancellationToken token = default)
        {
            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            viewModel.TrimValues();

            try
            {
                var checkStatus = await _twilio.CheckVerificationCodeAsync(viewModel.Phone, otp);

                if (checkStatus == "approved")
                {
                    var idAccount = await _accountRepo.AddAccountAsync(viewModel.Email, viewModel.Phone, viewModel.Password, viewModel.FirstName, viewModel.LastName, false, token);

                    HttpContext.Session.SetInt32("IdAccount", idAccount);
                    HttpContext.Session.SetInt32("IsAdmin", 0);

                    return Redirect("/Private/Home");
                }

                return new EmptyResult();
            }
            catch (ApiException)
            {
                return Unauthorized();
            }
            catch (AccountEmailTakenException)
            {
                return new ConflictResult();
            }
        }

    }
}
