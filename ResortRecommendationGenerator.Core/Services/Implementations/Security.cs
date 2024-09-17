using ResortRecommendationGenerator.Core.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace ResortRecommendationGenerator.Core.Services.Implementations
{
    public class Security : ISecurity
    {
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public Security(string key, string iv)
        {
            _key = Convert.FromBase64String(key);
            _iv = Convert.FromBase64String(iv);
        }

        public async Task<byte[]> EncryptAsync(string text)
        {
            byte[] encrypted;

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = _key;
                aesAlg.IV = _iv;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            await swEncrypt.WriteAsync(text);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            return encrypted;
        }

        public async Task<string> DecryptAsync(byte[] data)
        {
            string text;

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = _key;
                aesAlg.IV = _iv;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(data))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            text = await srDecrypt.ReadToEndAsync();
                        }
                    }
                }
            }

            return text;
        }

        public async Task<byte[]> HashAsync(string text)
        {
            var ms = new MemoryStream(Encoding.UTF8.GetBytes(text));
            
            return await SHA256.HashDataAsync(ms);
        }
    }
}
