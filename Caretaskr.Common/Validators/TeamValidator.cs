using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class TeamValidator : AbstractValidator<TeamRequestViewModel>
    {
        public TeamValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
        }
    }

    public class TeamUserValidator : AbstractValidator<TeamUserRequestViewModel>
    {
        public TeamUserValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}