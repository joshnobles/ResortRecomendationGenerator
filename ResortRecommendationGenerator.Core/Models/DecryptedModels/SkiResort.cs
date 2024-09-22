using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResortRecommendationGenerator.Core.Models.DecryptedModels
{
    [Table("SkiResort")]
    public class SkiResort
    {
        [Key]
        public int IdSkiResort { get; set; }

        public string Name { get; set; } = string.Empty;

        public double Elevation { get; set; }

        public int NumGreenRuns { get; set; }

        public int NumBlueRuns { get; set; }

        public int NumBlackRuns { get; set; }

        public int NumDubBlackRuns { get; set; }

        public int NumLifts { get; set; }

        public bool IsEpicPass { get; set; }

        public bool IsIkonPass { get; set; }

        public bool IsIndyPass { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}
