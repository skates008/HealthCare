using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class BudgetValidator : AbstractValidator<CreateBudgetViewModel>
    {
        public BudgetValidator()
        {
            RuleFor(x => x.SourceOfBudget).NotEmpty();
            RuleFor(x => x.TotalBudget).NotEmpty();
            RuleFor(x => x.BudgetName).NotEmpty();
        }
    }
}