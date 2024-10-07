using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ResortRecomendationGenerator.Web.Pages
{
    public class LogoutModel : PageModel
    {
        public IActionResult OnGet()
        {
            HttpContext.Session.Remove("IdAccount");
            HttpContext.Session.Remove("IsAdmin");

            return Redirect("/Index");
        }
    }
}
