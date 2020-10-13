using Caretaskr.Common.Constant;
using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class UserManagementValidator : AbstractValidator<UserRequestViewModel>
    {
        public UserManagementValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage(ErrorMessage.EMAIL_INVALID);

            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.PhoneNumber).NotEmpty();
            RuleFor(x => x.Occupation).NotEmpty();
            //RuleFor(x => x.CompanyName).NotEmpty();
            //RuleFor(x => x.Address).NotEmpty();
            RuleFor(x => x.Address.State).NotEmpty();
            RuleFor(x => x.Address.City).NotEmpty();
            RuleFor(x => x.Address.PostalCode).NotEmpty();
            RuleFor(x => x.Address.StreetName).NotEmpty();
            RuleFor(x => x.Address.StreetNumber).NotEmpty();
            //RuleFor(x => x.Unit).NotEmpty();
        }
    }

    public class UserManagementUpdateValidator : AbstractValidator<UserViewModel>
    {
        public UserManagementUpdateValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage(ErrorMessage.EMAIL_INVALID);

            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.PhoneNumber).NotEmpty();
            RuleFor(x => x.Occupation).NotEmpty();
            //RuleFor(x => x.Address).NotEmpty();
            RuleFor(x => x.Address.State).NotEmpty();
            RuleFor(x => x.Address.City).NotEmpty();
            RuleFor(x => x.Address.PostalCode).NotEmpty();
            RuleFor(x => x.Address.StreetName).NotEmpty();
            RuleFor(x => x.Address.StreetNumber).NotEmpty();
        }
    }
}