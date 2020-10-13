using Caretaskr.Common.Constant;
using FluentValidation;

namespace Caretaskr.Common.Extension
{
    public static class RuleBuilderExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty().WithMessage(ErrorMessage.PASSWORD_EMPTY)
                .Matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
                .WithMessage(ErrorMessage.PASSWORD_INVALID_CREATE);
            return options;
        }
    }
}