using System.ComponentModel.DataAnnotations;

namespace ResortRecomendationGenerator.Web.ViewModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Email is Required")]
        [EmailAddress(ErrorMessage = "Invalid Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is Required")]
        public string Password { get; set; }

        public LoginViewModel()
        {
            Email = string.Empty;
            Password = string.Empty;
        }

        public void TrimValues()
        {
            Email = Email.Trim();
            Password = Password.Trim();
        }
    }
}
