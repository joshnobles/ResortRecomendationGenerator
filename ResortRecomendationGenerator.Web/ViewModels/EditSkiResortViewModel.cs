using System.ComponentModel.DataAnnotations;

namespace ResortRecomendationGenerator.Web.ViewModels
{
    public class EditSkiResortViewModel
    {
        [Required]
        public int IdSkiResort { get; set; }

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z0-9 '-]{4,50}$")]
        public string Name { get; set; } = string.Empty;

        [Required]
        public double Elevation { get; set; }

        [Required]
        public int TotalRuns { get; set; }

        [Required]
        public double GreenPercent { get; set; }

        [Required]
        public double BluePercent { get; set; }

        [Required]
        public double BlackPercent { get; set; }

        [Required]
        public int TerrainParkNum { get; set; }

        [Required]
        public double SnowmakingCoverage { get; set; }

        [Required]
        public int SkiableAcres { get; set; }

        [Required]
        public int NumLifts { get; set; }

        [Required]
        public bool IsEpicPass { get; set; }

        [Required]
        public bool IsIkonPass { get; set; }

        [Required]
        public bool IsIndyPass { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }
    }
}
