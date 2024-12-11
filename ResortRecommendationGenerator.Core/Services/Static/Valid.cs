using System.ComponentModel.DataAnnotations;

namespace ResortRecommendationGenerator.Core.Services.Static
{
    public static class Valid
    {
        public static bool ViewModel(object viewModel)
        {
            try
            {
                var vc = new ValidationContext(viewModel);

                Validator.ValidateObject(viewModel, vc, true);
            }
            catch
            {
                return false;
            }

            return true;
        }
    }
}
