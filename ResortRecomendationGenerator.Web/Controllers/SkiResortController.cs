using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            Console.WriteLine("GET endpoint hit");

            var resorts = await _context.SkiResort
                .ToListAsync(token);

            return resorts;
        }
    }
}
