using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class NoteValidator : AbstractValidator<NoteRequestViewModel>
    {
        public NoteValidator()
        {
            RuleFor(x => x.PatientId).NotEmpty();
            RuleFor(x => x.Text).NotEmpty();
            RuleFor(x => x.Type).NotNull().IsInEnum();
        }
    }
}