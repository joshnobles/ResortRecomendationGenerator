namespace ResortRecomendationGenerator.Web.Twilio
{
    public interface ITwilioService
    {
        public Task SendVerificationCodeAsync(string phone);

        public Task<string> CheckVerificationCodeAsync(string phone, string code);
    }
}
