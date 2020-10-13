using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class AllergiesValidator : AbstractValidator<CreateAllergiesRequestViewModel>
    {
        public AllergiesValidator()
        {
            RuleFor(x => x.ClinicalStatus).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Critical).NotEmpty();
            RuleFor(x => x.LastOccurenceDate).NotEmpty();
            RuleFor(x => x.Allergen).NotEmpty();
        }
    }
}