using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class MedicationValidator : AbstractValidator<CreateMedicationRequestViewModel>
    {
        public MedicationValidator()
        {
            RuleFor(x => x.Manufacturer).NotEmpty();
            RuleFor(x => x.Medicine).NotEmpty();
            RuleFor(x => x.FormOfMedicine).NotEmpty();
            RuleFor(x => x.Amount).NotEmpty();
            RuleFor(x => x.Frequency).NotEmpty();
            RuleFor(x => x.ExpirationDate).NotEmpty();
        }
    }
}