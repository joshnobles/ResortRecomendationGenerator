using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace ResortRecomendationGenerator.Web.ValidationAttributes
{
    public class ValidHostNameAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is null)
                return true;

            var host = value.ToString() ?? "";

            if (string.IsNullOrWhiteSpace(host))
                return true;            

            return Regex.IsMatch(host, @"^[A-Za-z.\-]{3,100}$");
        }
    }
}
