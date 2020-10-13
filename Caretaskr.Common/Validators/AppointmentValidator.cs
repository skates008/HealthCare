using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Enum;
using FluentValidation;

namespace Caretaskr.Common.Validators
{
    public class CreateAppointmentValidator : AbstractValidator<CreateAppointmentRequestViewModel>
    {
        public CreateAppointmentValidator()
        {
            RuleFor(x => x.StartTime).NotEmpty();
            RuleFor(x => x.EndTime).NotEmpty();
            RuleFor(x => x.PractitionerId).NotEmpty();
            RuleFor(x => x.PatientId).NotEmpty();
            RuleFor(x => x.Address.AddressType).NotEmpty();
            RuleFor(x => x.Address.Address).NotEmpty();
            RuleFor(x => x.AppointmentTypeId).NotEmpty().WithMessage("Appointment Type is Required");
            
 
        }
    }

    public class UpdateAppointmentValidator : AbstractValidator<UpdateAppointmentRequestViewModel>
    {
        public UpdateAppointmentValidator()
        {
            //RuleFor(x => x.AppointmentId).NotEmpty();
            RuleFor(x => x.StartTime).NotEmpty();
            RuleFor(x => x.EndTime).NotEmpty();
            RuleFor(x => x.PractitionerId).NotEmpty();
            RuleFor(x => x.PatientId).NotEmpty();
            RuleFor(x => x.AppointmentTypeId).NotEmpty().WithMessage("Appointment Type is Required");
            RuleFor(x => x.Address.AddressType).NotEmpty();
            RuleFor(x => x.Address.Address).NotEmpty();
        }
    }


    public class SaveObservationAppointmentValidator : AbstractValidator<SaveObservationViewModel>
    {
        public SaveObservationAppointmentValidator()
        {
            RuleFor(x => x.Observation).NotEmpty();
        }
    }

    public class SaveTreatmentNoteAppointmentValidator : AbstractValidator<SaveTreatmentNoteViewModel>
    {
        public SaveTreatmentNoteAppointmentValidator()
        {
            RuleFor(x => x.TreatmentNote).NotEmpty();
        }
    }

    public class SaveAssessmentAppointmentValidator : AbstractValidator<SaveAssessmentViewModel>
    {
        public SaveAssessmentAppointmentValidator()
        {
            RuleFor(x => x.Assessment).NotEmpty();
        }
    }


    public class AppointmentActionValidator : AbstractValidator<AppointmentActionRequestViewModel>
    {
        public AppointmentActionValidator()
        {
            // RuleFor(x => x.Action).NotEmpty();

            //Cancel
            When(x => x.Action.Equals(AppointmentAction.Cancel), () =>
            {
                RuleFor(x => x.CancelAppointmentReason).NotEmpty();
                //RuleFor(x => x.CancelNotes).NotEmpty();
            });

            //Reschedule
            When(x => x.Action.Equals(AppointmentAction.Reschedule), () =>
            {
                RuleFor(x => x.StartTime).NotEmpty();
                RuleFor(x => x.EndTime).NotEmpty();
                RuleFor(x => x.RescheduleReason).NotEmpty();
            });

            //Finalize
            When(x => x.Action.Equals(AppointmentAction.Finalize), () => {
                //RuleFor(x => x.InternalNote).NotEmpty();
                RuleFor(x => x.ExternalNote).NotEmpty();
                RuleFor(x => x.TimeEntry.AppointmentId).NotEmpty();
                RuleFor(x => x.TimeEntry.CareplanId).NotEmpty();
                RuleFor(x => x.TimeEntry.Name).NotEmpty();
            });

            //Internal Note
            When(x => x.Action.Equals(AppointmentAction.InternalNote), () =>
            {
                RuleFor(x => x.PatientId).NotEmpty();
                RuleFor(x => x.InternalNote).NotEmpty();
            });
        }
    }
}
