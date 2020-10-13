using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class CreateMyTaskValidator : AbstractValidator<CreateMyTaskViewModel>
    {
        public CreateMyTaskValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
        }
    }

    public class UpdateMyTaskValidator : AbstractValidator<UpdateMyTaskViewModel>
    {
        public UpdateMyTaskValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
        }
    }
}