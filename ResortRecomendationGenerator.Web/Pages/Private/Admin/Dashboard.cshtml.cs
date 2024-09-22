using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ResortRecomendationGenerator.Web.Pages.Private.Admin
{
    public class DashboardModel : PageModel
    {
        public IActionResult OnGet()
        {
            var idAccount = HttpContext.Session.GetInt32("IdAccount");
            var isAdmin = HttpContext.Session.GetInt32("IsAdmin");

            if (idAccount is null || isAdmin is null || isAdmin != 1)
                return Redirect("/Index");

            return Page();
        }
    }
}
