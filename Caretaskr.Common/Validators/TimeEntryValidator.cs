using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class TimeEntryValidator : AbstractValidator<TimeEntryRequestViewModel>
    {
        public TimeEntryValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.BillableItems).NotEmpty();
        }
    }

    public class TimeEntryBillableItemValidator : AbstractValidator<TimeEntryBillableItemRequestViewModel>
    {
        public TimeEntryBillableItemValidator()
        {
            RuleFor(x => x.StartTime).NotEmpty();
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThanOrEqualTo(1);
        }
    }
}