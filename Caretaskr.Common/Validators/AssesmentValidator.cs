using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class AssesmentValidator : AbstractValidator<AssesmentRequestViewModel>
    {
        public AssesmentValidator()
        {
            RuleFor(x => x.PatientId).NotEmpty();
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.AssessmentDate).NotEmpty().LessThan(x => x.ValidToDate);
            RuleFor(x => x.ValidFromDate).NotEmpty().LessThan(x => x.ValidToDate);
            RuleFor(x => x.ValidToDate).NotEmpty();
            RuleFor(x => x.Assessor).NotEmpty();
        }
    }
}