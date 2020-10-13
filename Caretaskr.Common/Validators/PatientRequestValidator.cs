using System;
using Caretaskr.Common.Constant;
using Caretaskr.Common.ViewModel;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class PatientRegisterRequestValidator : AbstractValidator<PatientRegisterRequestViewModel>
    {
        public PatientRegisterRequestValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.NDISNumber).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Gender).IsInEnum(); //.NotEmpty();
            RuleFor(x => x.DateOfBirth).NotEmpty().LessThanOrEqualTo(DateTime.Now)
                .WithMessage(ErrorMessage.DATE_OF_BIRTH_LESS_THAN);
            RuleFor(x => x.Language).NotEmpty();
            RuleFor(x => x.Address.State).NotEmpty();
            RuleFor(x => x.Address.City).NotEmpty();
            RuleFor(x => x.Address.PostalCode).NotEmpty();
            RuleFor(x => x.Address.StreetName).NotEmpty();
            RuleFor(x => x.Address.StreetNumber).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage(ErrorMessage.EMAIL_INVALID);
            RuleFor(x => x.SchoolEmail).EmailAddress().WithMessage(ErrorMessage.SCHOOL_EMAIL_INVALID)
                .Unless(x => string.IsNullOrEmpty(x.SchoolEmail));
            RuleFor(x => x.SchoolTeacherEmail).EmailAddress().WithMessage(ErrorMessage.SCHOOL_TEACHER_EMAIL_INVALID)
                .Unless(x => string.IsNullOrEmpty(x.SchoolTeacherEmail));
        }
    }

    public class PatientCustodianRequestValidator : AbstractValidator<PatientCustodianViewModel>
    {
        public PatientCustodianRequestValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage(ErrorMessage.CARER_EMAIL_INVALID);
            RuleFor(x => x.Contact).NotEmpty();
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.Relation).NotEmpty();
        }
    }

    public class UpdatePatientRequestValidator : AbstractValidator<UpdatePatientRequestViewModel>
    {
        public UpdatePatientRequestValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.NDISNumber).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Gender).NotEmpty();
            RuleFor(x => x.DateOfBirth).NotEmpty().LessThanOrEqualTo(DateTime.Now)
                .WithMessage(ErrorMessage.DATE_OF_BIRTH_LESS_THAN);
            RuleFor(x => x.Language).NotEmpty();
            RuleFor(x => x.Address.State).NotEmpty();
            RuleFor(x => x.Address.City).NotEmpty();
            RuleFor(x => x.Address.PostalCode).NotEmpty();
            RuleFor(x => x.Address.StreetName).NotEmpty();
            RuleFor(x => x.Address.StreetNumber).NotEmpty();
        }
    }

    public class PatientCustodianValidator : AbstractValidator<PatientCustodianViewModel>
    {
        public PatientCustodianValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage(ErrorMessage.CARER_EMAIL_INVALID);
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.Contact).NotEmpty();
            RuleFor(x => x.Relation).NotEmpty();
        }
    }

    public class PatientRegistrationCompleteValidator : AbstractValidator<InitPatientRegistrationtViewModel>
    {
        public PatientRegistrationCompleteValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.NDISNumber).NotEmpty().MaximumLength(20);


            When(x => x.HasCarer.Equals(true), () =>
            {
                RuleFor(x => x.CarerEmail).NotEmpty().EmailAddress().WithMessage(ErrorMessage.CARER_EMAIL_INVALID);
                RuleFor(x => x.CarerContact).NotEmpty();
                RuleFor(x => x.CarerFirstName).NotEmpty();
                RuleFor(x => x.CarerLastName).NotEmpty();
                RuleFor(x => x.CarerRelation).NotEmpty();
            });
        }
    }
}