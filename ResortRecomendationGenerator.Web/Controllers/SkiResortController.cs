using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;

namespace ResortRecomendationGenerator.Web.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class SkiResortController : ControllerBase
    {
        private readonly Context _context;

        public SkiResortController(Context context)
        {
            _context = context;
        }

        [HttpGet("")]
        public async Task<List<SkiResort>> GetAllResortsAsync(CancellationToken token = default)
        {
            var resorts = await _context.SkiResort
                .ToListAsync(token);

            return resorts;
        }

        [HttpPost("AddResort")]
        public async Task<IActionResult> AddResortAsync([FromBody] NewSkiResortViewModel viewModel, CancellationToken token = default)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (await _context.SkiResort.AnyAsync(r => r.Name.ToLower() == viewModel.Name.ToLower(), token))
                return Conflict();

            var newResort = new SkiResort()
            {
                Name = viewModel.Name,
                Elevation = viewModel.Elevation,
                NumGreenRuns = viewModel.NumGreenRuns,
                NumBlueRuns = viewModel.NumBlueRuns,
                NumBlackRuns = viewModel.NumBlackRuns,
                NumDubBlackRuns = viewModel.NumDubBlackRuns,
                NumLifts = viewModel.NumLifts,
                IsEpicPass = viewModel.IsEpicPass,
                IsIkonPass = viewModel.IsIkonPass,
                IsIndyPass = viewModel.IsIndyPass,
                Latitude = viewModel.Latitude,
                Longitude = viewModel.Longitude,
            };

            await _context.SkiResort.AddAsync(newResort, CancellationToken.None);
            await _context.SaveChangesAsync(CancellationToken.None);

            return Ok();
        }
    }
}
