namespace ResortRecommendationGenerator.Core.Services.Interfaces
{
    public interface ISecurity
    {
        public Task<byte[]> EncryptAsync(string text);

        public Task<string> DecryptAsync(byte[] data);

        public Task<byte[]> HashAsync(string text);
    }
}
