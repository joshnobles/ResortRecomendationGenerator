﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResortRecommendationGenerator.Core.Models.DecryptedModels
{
    [Table("PotentialSkiResort")]
    public class PotentialSkiResort
    {
        [Key]
        public int IdPotentialSkiResort { get; set; }

        public string Name { get; set; } = string.Empty;

        public double Elevation { get; set; }

        public int TotalRuns { get; set; }

        public double GreenPercent { get; set; }

        public double BluePercent { get; set; }

        public double BlackPercent { get; set; }

        public int TerrainParkNum { get; set; }

        public double SnowmakingCoverage { get; set; }

        public int SkiableAcres { get; set; }

        public int NumLifts { get; set; }

        public bool IsEpicPass { get; set; }

        public bool IsIkonPass { get; set; }

        public bool IsIndyPass { get; set; }

        public string Description { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}