using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResortRecommendationGenerator.Core.Models.EncryptedModels
{
    [Table("Account")]
    public class EncryptedAccount
    {
        [Key]
        public int IdAccount { get; set; }

        public byte[] FirstName { get; set; } = [];

        public byte[] LastName { get; set; } = [];

        public byte[] Email { get; set; } = [];

        public byte[] Password { get; set; } = [];
        
        public bool IsAdmin { get; set; }
    }
}
