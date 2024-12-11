using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResortRecommendationGenerator.Core.Models.EncryptedModels
{
    [Table("ApiKey")]
    public class EncryptedApiKey
    {
        [Key]
        public int IdApiKey { get; set; }

        public int IdAccount { get; set; }

        public byte[] Name { get; set; } = [];

        public byte[] Value { get; set; } = [];

        public byte[]? AllowedHost { get; set; }
    }
}
