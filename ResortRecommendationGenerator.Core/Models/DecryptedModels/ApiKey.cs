namespace ResortRecommendationGenerator.Core.Models.DecryptedModels
{
    public class ApiKey
    {
        public int IdApiKey { get; set; }

        public int IdAccount { get; set; }

        public string Value { get; set; } = string.Empty;
    }
}
