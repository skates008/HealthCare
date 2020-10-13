using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Enum;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class CreateCarePlanValidator : AbstractValidator<CreateCarePlanViewModel>
    {
        public CreateCarePlanValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.BillingType).NotNull().IsInEnum();
            RuleFor(x => x.ServiceBookingReference).NotEmpty().When(x => x.BillingType == BillingType.AGENCY_MANAGED);
        }
    }
}