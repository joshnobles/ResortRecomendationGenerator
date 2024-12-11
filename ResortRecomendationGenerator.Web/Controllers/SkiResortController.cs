using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Services.Interfaces;

namespace ResortRecomendationGenerator.Web.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class SkiResortController : ControllerBase
    {
        private readonly Context _context;
        private readonly IApiKeyRepository _apiKeyRepo;

        public SkiResortController(Context context, IApiKeyRepository apiKeyRepo)
        {
            _context = context;
            _apiKeyRepo = apiKeyRepo;
        }

        [HttpGet("")]
        public async Task<ActionResult<List<SkiResort>>> GetAllResortsAsync([FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, GetHostName(HttpContext), false, token))
                return Unauthorized("Invalid API Key");

            var resorts = await _context.SkiResort
                .ToListAsync(token);

            return resorts;
        }

        [HttpGet("{idSkiResort:int}")]
        public async Task<IActionResult> GetResortByIdAsync([FromRoute] int idSkiResort, [FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, GetHostName(HttpContext), false, token))
                return Unauthorized("Invalid API Key");

            var resort = await _context.SkiResort.FirstOrDefaultAsync(s => s.IdSkiResort == idSkiResort, token);

            if (resort is null)
                return NotFound();

            return new JsonResult(resort);
        }

        [HttpPost("AddResort")]
        public async Task<IActionResult> AddResort([FromBody] NewSkiResortViewModel viewModel, [FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, GetHostName(HttpContext), false, token))
                return Unauthorized("Invalid API Key");

            var resortExists1 = await _context.SkiResort
                .AnyAsync(s => s.Name.ToLower() == viewModel.Name.ToLower(), token);

            var resortExists2 = await _context.PotentialSkiResort
                .AnyAsync(s => s.Name.ToLower() == viewModel.Name.ToLower(), token);

            if (resortExists1 || resortExists2)
                return Conflict("This resort already exists");

            var potentialResort = new PotentialSkiResort()
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
                Longitude = viewModel.Longitude
            };

            await _context.PotentialSkiResort
                .AddAsync(potentialResort, CancellationToken.None);

            await _context.SaveChangesAsync(CancellationToken.None);

            return Ok("Thank you for your submission, it will be reviewed before addition to our resort list!");
        }

        private static string GetHostName(HttpContext context) => context.Request.Host.Host;

    }
}
