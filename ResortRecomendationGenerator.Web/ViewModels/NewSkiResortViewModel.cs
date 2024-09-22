using System.ComponentModel.DataAnnotations;

namespace ResortRecomendationGenerator.Web.ViewModels
{
    public class NewSkiResortViewModel
    {
        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z0-9 '-]{4,50}$")]
        public string Name { get; set; } = string.Empty;

        [Required]
        public double Elevation { get; set; }

        [Required]
        public int NumGreenRuns { get; set; }

        [Required]
        public int NumBlueRuns { get; set; }

        [Required]
        public int NumBlackRuns { get; set; }

        [Required]
        public int NumDubBlackRuns { get; set; }

        [Required]
        public int NumLifts { get; set; }

        [Required]
        public bool IsEpicPass { get; set; }

        [Required]
        public bool IsIkonPass { get; set; }

        [Required]
        public bool IsIndyPass { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }
    }
}
