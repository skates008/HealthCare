using Caretaskr.Common.Constant;
using Caretaskr.Common.Extension;
using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class UserRegistrationValidator : AbstractValidator<UserRegisterRequestViewModel>
    {
        public UserRegistrationValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage(ErrorMessage.EMAIL_INVALID);
            RuleFor(x => x.Password).Password();
            RuleFor(x => x.UserType).NotEmpty();
        }
    }

    public class EmailConfirmationValidator : AbstractValidator<EmailConfirmationViewModel>
    {
        public EmailConfirmationValidator()
        {
            RuleFor(x => x.Code).NotEmpty();
        }
    }

    public class ResetPasswordValidator : AbstractValidator<ResetPasswordViewModel>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Password).Password();
            RuleFor(x => x.Code).NotEmpty();
        }
    }

    public class RegistrationCompleteValidator : AbstractValidator<InitRegistrationtViewModel>
    {
        public RegistrationCompleteValidator()
        {
            RuleFor(x => x.FullName).NotEmpty();
        }
    }


    public class ChangePasswordValidator : AbstractValidator<ChangePasswordViewModel>
    {
        public ChangePasswordValidator()
        {
            RuleFor(x => x.NewPassword).Password();
            RuleFor(x => x.ConfirmPassword).Equal(c => c.NewPassword).When(c => !string.IsNullOrEmpty(c.NewPassword))
                .WithMessage(ErrorMessage.PASSWORD_CONFIRM);
            RuleFor(x => x.CurrentPassword).NotEmpty();
        }
    }
}