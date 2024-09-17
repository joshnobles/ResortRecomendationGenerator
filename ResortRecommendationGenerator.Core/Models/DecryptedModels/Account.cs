﻿namespace ResortRecommendationGenerator.Core.Models.DecryptedModels
{
    public class Account
    {
        public int IdAccount { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public bool IsAdmin { get; set; }
    }
}
