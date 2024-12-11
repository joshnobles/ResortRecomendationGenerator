using System.ComponentModel.DataAnnotations;

namespace ResortRecomendationGenerator.Web.ValidationAttributes
{
    public class ValidImageAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is null)
                return false;

            if (value is not IFormFile formFile)
                return false;

            var validBytes = GetValidBytes();

            using var reader = new BinaryReader(formFile.OpenReadStream());

            var headerBytes = reader.ReadBytes(validBytes.Max(x => x.Length));

            foreach (var arry in validBytes)
            {
                for (int i = 0; i < arry.Length; i++)
                {
                    if (arry[i] == null)
                        continue;

                    if (arry[i] != headerBytes[i])
                        break;

                    if (i == arry.Length - 1)
                        return true;
                }
            }

            return true;
        }

        private static List<byte?[]> GetValidBytes()
        {
            List<byte?[]> bytes = [
                    // JPEG, JPG, PNG
                    [0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46],
                    [0x49, 0x46, 0x00, 0x01],
                    [0xFF, 0xD8, 0xFF, 0xEE],
                    [0xFF, 0xD8, 0xFF, 0xE1, null, null, 0x45, 0x78],
                    [0x69, 0x66, 0x00, 0x00],
                    [0xFF, 0xD8, 0xFF, 0xE0],
                    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
            ];

            return bytes;
        }

    }
}
