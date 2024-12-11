using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace ResortRecomendationGenerator.Web.Twilio
{
    public class TwilioService : ITwilioService, IDisposable
    {
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _pathServiceSid;

        public TwilioService(string accountSid, string authToken, string pathServiceSid)
        {
            _accountSid = accountSid;
            _authToken = authToken;
            _pathServiceSid = pathServiceSid;
        }


        public async Task SendVerificationCodeAsync(string phone)
        {
            TwilioClient.Init(_accountSid, _authToken);

            string phoneNum = phone.StartsWith('+') ? phone : FormatPhone(phone);

            await VerificationResource.CreateAsync
            (
                to: phoneNum,
                channel: "sms",
                pathServiceSid: _pathServiceSid
            );
        }

        public async Task<string> CheckVerificationCodeAsync(string phone, string code)
        {
            TwilioClient.Init(_accountSid, _authToken);

            string phoneNum = phone.StartsWith('+') ? phone : FormatPhone(phone);

            var check = await VerificationCheckResource.CreateAsync
            (
                to: phoneNum,
                code: code,
                pathServiceSid: _pathServiceSid
            );

            return check.Status;
        }

        private static string FormatPhone(string phone) => "+1" + phone;

        public void Dispose()
        {
            TwilioClient.Invalidate();
        }
    }
}
