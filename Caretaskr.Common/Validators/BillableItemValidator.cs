using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class BillableItemValidator : AbstractValidator<BillableItemRequestViewModel>
    {
        public BillableItemValidator()
        {
            RuleFor(x => x.IsBillable).NotNull().Must(x => x == false || x);
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Price).NotEmpty().When(x => x.IsBillable);
            RuleFor(x => x.Unit).NotEmpty();
            RuleFor(x => x.GSTCode).NotEmpty().When(x => x.IsBillable);
        }
    }
}