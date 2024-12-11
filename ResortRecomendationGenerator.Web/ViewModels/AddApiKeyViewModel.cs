using ResortRecomendationGenerator.Web.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace ResortRecomendationGenerator.Web.ViewModels
{
    public class AddApiKeyViewModel
    {
        [Required]
        [RegularExpression(@"^[A-Za-z _]{3,50}$")]
        public string Name { get; set; } = string.Empty;

        [ValidHostName]
        public string? AllowedHost { get; set; }
    }
}
