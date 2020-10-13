using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class AppointmentTypeValidator : AbstractValidator<AppointmentTypeViewModel>
    {
        public AppointmentTypeValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.IsBillable).NotNull().Must(x => x == false || x);

        }
    }

}