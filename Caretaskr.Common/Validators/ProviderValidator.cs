using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class ProviderValidator : AbstractValidator<ProviderRequestViewModel>
    {
        public ProviderValidator()
        {
            //TODO:Clarify which ones are mandatory
            //RuleFor(x => x.TradingName).NotEmpty();
            //RuleFor(x => x.EntityName).NotEmpty();
            //RuleFor(x => x.Address).NotEmpty();
            //RuleFor(x => x.Email).NotEmpty();
            //RuleFor(x => x.PhoneNumber).NotEmpty();
            //RuleFor(x => x.ABNNumber).NotEmpty();
            //RuleFor(x => x.IsNDISRegistered).NotEmpty();
            //RuleFor(x => x.NDISNumber).NotEmpty();
            //RuleFor(x => x.PrimaryContactName).NotEmpty();
            //RuleFor(x => x.PrimaryContactEmail).NotEmpty();
            //RuleFor(x => x.NDISServicesProvided).NotEmpty();
            //RuleFor(x => x.OtherServices).NotEmpty();
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.RegistrationNumber).NotEmpty();
        }
    }
}