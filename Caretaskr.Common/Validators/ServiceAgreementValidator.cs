using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class ServiceAgreementValidator : AbstractValidator<ServiceAgreementRequestViewModel>
    {
        public ServiceAgreementValidator()
        {
            RuleFor(x => x.PatientId).NotEmpty();
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.SignedDate).NotEmpty().LessThan(x => x.ValidToDate);
            RuleFor(x => x.ValidFromDate).NotEmpty().LessThan(x => x.ValidToDate);
            RuleFor(x => x.ValidToDate).NotEmpty();
        }
    }
}