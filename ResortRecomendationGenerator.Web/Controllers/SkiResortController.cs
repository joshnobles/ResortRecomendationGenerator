using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResortRecomendationGenerator.Web.ViewModels;
using ResortRecommendationGenerator.Core.DataAccess;
using ResortRecommendationGenerator.Core.Exceptions;
using ResortRecommendationGenerator.Core.Models.DecryptedModels;
using ResortRecommendationGenerator.Core.Services.Implementations;
using ResortRecommendationGenerator.Core.Services.Interfaces;
using ResortRecommendationGenerator.Core.Services.Static;

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
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, false, token))
                return Unauthorized("Invalid API Key");

            var resorts = await _context.SkiResort
                .ToListAsync(token);

            return resorts;
        }

        [HttpGet("{idSkiResort:int}")]
        public async Task<ActionResult<SkiResort>> GetResortByIdAsync([FromRoute] int idSkiResort, [FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, false, token))
                return Unauthorized("Invalid API Key");

            var resort = await _context.SkiResort.FirstOrDefaultAsync(s => s.IdSkiResort == idSkiResort, token);

            if (resort is null)
                return NotFound();

            return Ok(resort);
        }

        [HttpPost("AddResort")]
        public async Task<IActionResult> AddResortAsync([FromBody] NewSkiResortViewModel viewModel, [FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, true, token))
                return Unauthorized("You do not have access to this endpoint");

            if (!Valid.ViewModel(viewModel))
                return BadRequest();

            if (await _context.SkiResort.AnyAsync(r => r.Name.ToLower() == viewModel.Name.ToLower(), token))
                return Conflict();

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
                Latitude = viewModel.Latitude,
                Longitude = viewModel.Longitude,
            };

            await _context.SkiResort.AddAsync(newResort, CancellationToken.None);
            await _context.SaveChangesAsync(CancellationToken.None);

            return Ok();
        }

        [HttpPut("EditResort")]
        public async Task<IActionResult> EditResortAsync([FromBody] EditSkiResortViewModel viewModel, [FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, true, token))
                return Unauthorized("You do not have access to this endpoint");

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
            currentResort.Latitude = viewModel.Latitude;
            currentResort.Longitude = viewModel.Longitude;

            await _context.SaveChangesAsync(CancellationToken.None);

            return Ok();
        }

        [HttpDelete("DeleteResort/{idSkiResort:int}")]
        public async Task<IActionResult> DeleteResortAsync([FromRoute] int idSkiResort, [FromQuery] string key, CancellationToken token = default)
        {
            if (!await _apiKeyRepo.TryValidateKeyAsync(key, true, token))
                return Unauthorized("You do not have access to this endpoint");

            var skiResort = await _context.SkiResort.FirstOrDefaultAsync(r => r.IdSkiResort == idSkiResort, token);
            
            if (skiResort is null)
                return BadRequest();

            _context.SkiResort.Remove(skiResort);
            await _context.SaveChangesAsync(CancellationToken.None);

            return Ok();
        }

    }
}
