using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Services.Static;

namespace ResortRecomendationGenerator.Web.Pages.Private.Admin
{
    public class DashboardModel : PageModel
    {
        private readonly Context _context;

        public DashboardModel(Context context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            return Page();
        }

        public async Task<IActionResult> OnGetPotentialResorts(CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            var resorts = await _context.PotentialSkiResort
                .ToListAsync(token);

            return new JsonResult(resorts);
        }

        public async Task<IActionResult> OnGetSpecificPotentialResort([FromQuery] int idPotentialResort, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            var potentialResort = await _context.PotentialSkiResort
                .FirstOrDefaultAsync(r => r.IdPotentialSkiResort == idPotentialResort, token);

            if (potentialResort is null)
                return NotFound();

            return new JsonResult(potentialResort);
        }

        public async Task<IActionResult> OnPostAcceptPotentialResort([FromQuery] int idPotentialResort, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            var potentialResort = await _context.PotentialSkiResort
                .FirstOrDefaultAsync(r => r.IdPotentialSkiResort == idPotentialResort, token);

            if (potentialResort is null)
                return NotFound();

            var acceptedResort = new SkiResort()
            {
                Name = potentialResort.Name,
                Elevation = potentialResort.Elevation,
                TotalRuns = potentialResort.TotalRuns,
                GreenPercent = potentialResort.GreenPercent,
                BluePercent = potentialResort.BluePercent,
                BlackPercent = potentialResort.BlackPercent,
                TerrainParkNum = potentialResort.TerrainParkNum,
                SnowmakingCoverage = potentialResort.SnowmakingCoverage,
                SkiableAcres = potentialResort.SkiableAcres,
                NumLifts = potentialResort.NumLifts,
                IsEpicPass = potentialResort.IsEpicPass,
                IsIkonPass = potentialResort.IsIkonPass,
                IsIndyPass = potentialResort.IsIndyPass,
                Description = potentialResort.Description,
                Latitude = potentialResort.Latitude,
                Longitude = potentialResort.Longitude
            };

            if (await _context.SkiResort.AnyAsync(r => r.Name.ToLower() == acceptedResort.Name.ToLower()))
                return new ConflictResult();

            await _context.SkiResort
                .AddAsync(acceptedResort, CancellationToken.None);

            _context.PotentialSkiResort.Remove(potentialResort);

            await _context.SaveChangesAsync(CancellationToken.None);

            return new EmptyResult();
        }

        public async Task<IActionResult> OnPostAddResort([FromBody] NewSkiResortViewModel viewModel, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            if (await _context.SkiResort.AnyAsync(r => r.Name.ToLower() == viewModel.Name.ToLower(), token))
                return new ConflictResult();

            var newResort = new SkiResort()
            {
                Name = viewModel.Name,
                Elevation = viewModel.Elevation,
                TotalRuns = viewModel.TotalRuns,
                GreenPercent = viewModel.GreenPercent,
                BluePercent = viewModel.BluePercent,
                BlackPercent = viewModel.BlackPercent,
                TerrainParkNum = viewModel.TerrainParkNum,
                SnowmakingCoverage = viewModel.SnowmakingCoverage,
                SkiableAcres = viewModel.SkiableAcres,
                NumLifts = viewModel.NumLifts,
                IsEpicPass = viewModel.IsEpicPass,
                IsIkonPass = viewModel.IsIkonPass,
                IsIndyPass = viewModel.IsIndyPass,
                Description = viewModel.Description,
                Latitude = viewModel.Latitude,
                Longitude = viewModel.Longitude,
            };

            await _context.SkiResort.AddAsync(newResort, CancellationToken.None);
            await _context.SaveChangesAsync(CancellationToken.None);

            return new EmptyResult();
        }
        
        public async Task<IActionResult> OnPutUpdateResort([FromBody] EditSkiResortViewModel viewModel, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            var currentResort = await _context.SkiResort.FirstOrDefaultAsync(r => r.IdSkiResort == viewModel.IdSkiResort, token);

            if (currentResort is null)
                return NotFound();

            currentResort.Name = viewModel.Name;
            currentResort.Elevation = viewModel.Elevation;
            currentResort.TotalRuns = viewModel.TotalRuns;
            currentResort.GreenPercent = viewModel.GreenPercent;
            currentResort.BluePercent = viewModel.BluePercent;
            currentResort.BlackPercent = viewModel.BlackPercent;
            currentResort.TerrainParkNum = viewModel.TerrainParkNum;
            currentResort.SnowmakingCoverage = viewModel.SnowmakingCoverage;
            currentResort.SkiableAcres = viewModel.SkiableAcres;
            currentResort.NumLifts = viewModel.NumLifts;
            currentResort.IsEpicPass = viewModel.IsEpicPass;
            currentResort.IsIkonPass = viewModel.IsIkonPass;
            currentResort.IsIndyPass = viewModel.IsIndyPass;
            currentResort.Description = viewModel.Description;
            currentResort.Latitude = viewModel.Latitude;
            currentResort.Longitude = viewModel.Longitude;

            await _context.SaveChangesAsync(CancellationToken.None);

            return new EmptyResult();
        }

        public async Task<IActionResult> OnDeleteSkiResort([FromBody] int idSkiResort, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            var resort = await _context.SkiResort
                .FirstOrDefaultAsync(s => s.IdSkiResort == idSkiResort, token);

            if (resort is null)
                return NotFound();

            _context.SkiResort.Remove(resort);
            await _context.SaveChangesAsync(CancellationToken.None);

            return new EmptyResult();
        }

        public async Task<IActionResult> OnDeleteRejectPotentialResort([FromQuery] int idPotentialResort, CancellationToken token = default)
        {
            if (!CheckSession(out int idAccount))
                return Redirect("/Logout");

            var resort = await _context.PotentialSkiResort
                .FirstOrDefaultAsync(x => x.IdPotentialSkiResort == idPotentialResort, token);

            if (resort is null)
                return NotFound();

            _context.PotentialSkiResort.Remove(resort);
            await _context.SaveChangesAsync(CancellationToken.None);

            return new EmptyResult();
        }

        private bool CheckSession(out int idAccount)
        {
            idAccount = 0;

            var id = HttpContext.Session.GetInt32("IdAccount");
            var isAdmin = HttpContext.Session.GetInt32("IsAdmin");

            if (id is null || isAdmin is null || isAdmin != 1)
                return false;

            idAccount = (int)id;

            return true;
        }
    }
}
