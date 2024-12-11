using System.ComponentModel.DataAnnotations;

namespace ResortRecomendationGenerator.Web.ViewModels
{
    public class OtpViewModel
    {
        [Required]
        public int IdAccount { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{6}$")]
        public string Otp { get; set; } = string.Empty;
    }
}
