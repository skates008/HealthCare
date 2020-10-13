using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class MyProfileBasicDetailsValidator : AbstractValidator<MyProfileBasicDetailsViewModel>
    {
        public MyProfileBasicDetailsValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.PhoneNumber).NotEmpty();
        }
    }
}