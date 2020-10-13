using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class AppointmentViewModel : CreateAppointmentRequestViewModel
    {
        public Guid Id { get; set; }
        public DateTime ModifiedDate { get; set; }

        public List<AppointmentObservationViewModel> Observations { get; set; }
        public List<AppointmentTreatmentNoteViewModel> TreatmentNotes { get; set; }
        public List<AppointmentAssessmentViewModel> Assessments { get; set; }

    }

    public class CreateAppointmentRequestViewModel
    {

        public Guid PractitionerId { get; set; }
        public Guid PatientId { get; set; }
        public Guid? AppointmentTypeId { get; set; }
        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }
        public string Note { get; set; }
        public DateTime AppointmentDate { get; set; }

        public AddressViewModel Address { get; set; } = new AddressViewModel();

        public bool IsRecurring { get; set; }
        public AppointmentRecurrenceViewModel Recurrence { get; set; }
    }

    public class AppointmentRecurrenceViewModel
    {
        public Guid? GroupId { get; set; }
        public string RRule { get; set; }
        public bool isException { get; set; }

    }

    public class AppointmentResponseViewModel : CreateAppointmentRequestViewModel
    {
        public Guid Id { get; set; }

        public string PractitionerName { get; set; }
        public string PatientName { get; set; }
        public string PatientContactNo { get; set; }
        public AppointmentStatus AppointmentStatus { get; set; }
        public DateTime? CheckInTime { get; set; }

        public DateTime? CheckOutTime { get; set; }
        public string AppointmentTypeName { get; set; }

        public bool IsRecurring { get; set; }
        public AppointmentRecurrenceViewModel Recurrence { get; set; }
    }

    public class AppointmentDetailsViewModel
    {
        public Guid Id { get; set; }
        public Guid PractitionerId { get; set; }
        public Guid PatientId { get; set; }
        public string PractitionerName { get; set; }
        public string PatientName { get; set; }
        public string PatientContactNo { get; set; }
        public AppointmentStatus AppointmentStatus { get; set; }
        public DateTime AppointmentDate { get; set; }
        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string CarePlanName { get; set; }
        public string Notes { get; set; }
        public string InternalNote { get; set; }
        public string ExternalNote { get; set; }

        public string PatientEmail { get; set; }

        public string AppointmentType { get; set; }

        public decimal? TotalCost { get; set; }

        public InvoiceListViewModel Invoice { get; set; }

        public List<TimeEntryViewModel> TimeEntries { get; set; } = new List<TimeEntryViewModel>();
        public AddressViewModel Address { get; set; } = new AddressViewModel();

        public bool IsRecurring { get; set; }
        public AppointmentRecurrenceViewModel Recurrence { get; set; }

    }


    public class SaveObservationViewModel
    {
        public Guid AppointmentId { get; set; }
        public string Observation { get; set; }
    }

    public class AppointmentObservationViewModel
    {
        public Guid Id { get; set; }

        public string Text { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }

    public class AppointmentTreatmentNoteViewModel
    {
        public Guid Id { get; set; }

        public string Text { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }

    public class AppointmentAssessmentViewModel
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }

    public class SaveAssessmentViewModel
    {
        public Guid AppointmentId { get; set; }
        public string Assessment { get; set; }
    }

    public class SaveTreatmentNoteViewModel
    {
        public Guid AppointmentId { get; set; }
        public string TreatmentNote { get; set; }
    }

    public class AppointmentActionRequestViewModel
    {
        public Guid Id { get; set; }
        public AppointmentAction Action { get; set; }

        //Cancel
        public CancelAppointmentReason CancelAppointmentReason { get; set; }
        public string CancelNotes { get; set; }

        //Reschedule
        public Guid PatientId { get; set; }
        public Guid PractitionerId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string RescheduleReason { get; set; }

        //Finalize

        public string ExternalNote { get; set; }
        public TimeEntryRequestViewModel TimeEntry { get; set; }

        //Internal Note
        public string InternalNote { get; set; }
        public Guid? CareplanId { get; set; }

        public AppointmentRecurrenceViewModel Recurrence { get; set; }

    }


    public class UpdateAppointmentRequestViewModel : CreateAppointmentRequestViewModel
    {
        public Guid AppointmentId { get; set; }
    }

    public class ListAppointmentResponseViewModel : CreateAppointmentRequestViewModel
    {
        public Guid Id { get; set; }
        public string PractitionerName { get; set; }
        public string PatientName { get; set; }
        public AppointmentStatus? AppointmentStatus { get; set; }
        public CancelAppointmentReason? CancelAppointmentReason { get; set; }
        public string CancelNotes { get; set; }

        public string ResourceId { get; set; }
    }


    public class AppointmentListRequestViewModel
    {
        public int Results { get; set; }


        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public Guid? ParticipantId { get; set; }
        public Guid? PractitionerId { get; set; }
        public Guid? TeamId { get; set; }
    }

    #region Timeline view

    public class ResourceViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
    }

    public class TeamResourceViewModel : ResourceViewModel
    {
        public List<ResourceViewModel> Children { get; set; } = new List<ResourceViewModel>();
    }

    #endregion

    public class AppointmentTypeViewModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public bool IsBillable { get; set; } = true;
    }

    #region Appointment Grid View

    public class AppointmentListGridViewModel
    {
        public List<ListAppointmentResponseViewModel> Events = new List<ListAppointmentResponseViewModel>();
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    #endregion


    public class AppointmentMapper : Profile
    {
        public AppointmentMapper()
        {
            CreateMap<CreateAppointmentRequestViewModel, Appointment>()
                .ForMember(dest => dest.AppointmentTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.RecurrenceGroup, opt => opt.Ignore())
                .ForMember(dest => dest.RecurrenceGroupId, opt => opt.Ignore());



            CreateMap<UpdateAppointmentRequestViewModel, Appointment>()
                .ForMember(dest => dest.AppointmentTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.RecurrenceGroup, opt => opt.Ignore())
                .ForMember(dest => dest.RecurrenceGroupId, opt => opt.Ignore());

            CreateMap<Appointment, UpdateAppointmentRequestViewModel>();

            CreateMap<AppointmentNote, AppointmentObservationViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.CreatedBy, src => src.MapFrom(x => x.CreatedBy.FullName));

            CreateMap<AppointmentNote, AppointmentTreatmentNoteViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.CreatedBy, src => src.MapFrom(x => x.CreatedBy.FullName));

            CreateMap<AppointmentNote, AppointmentAssessmentViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.CreatedBy, src => src.MapFrom(x => x.CreatedBy.FullName));


            CreateMap<Appointment, ListAppointmentResponseViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PractitionerName, src => src.MapFrom(x => x.Practitioner.FullName))
                .ForMember(dest => dest.PatientName, src => src.MapFrom(x => x.PatientRecord.Patient.User.FullName))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.AppointmentTypeId, src => src.MapFrom(x => x.AppointmentType.PublicId))
                .ForPath(dest => dest.Recurrence.isException, src => src.MapFrom(x => x.IsRecurrenceException))
                .ForPath(dest => dest.Recurrence.RRule, src => src.MapFrom(x => x.RecurrenceGroup.Rrule))
                .ForPath(dest => dest.Recurrence.GroupId, src => src.MapFrom(x => x.RecurrenceGroup.PublicId));

            CreateMap<Appointment, AppointmentResponseViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PractitionerName, src => src.MapFrom(x => x.Practitioner.FullName))
                .ForMember(dest => dest.PatientName, src => src.MapFrom(x => x.PatientRecord.Patient.User.FullName))
                .ForMember(dest => dest.PatientContactNo,
                    src => src.MapFrom(x => x.PatientRecord.Patient.User.PhoneNumber))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.AppointmentTypeId, src => src.MapFrom(x => x.AppointmentType.PublicId))
                .ForMember(dest => dest.AppointmentTypeName, src => src.MapFrom(x => x.AppointmentType.Name))
                .ForPath(dest => dest.Recurrence.isException, src => src.MapFrom(x => x.IsRecurrenceException))
                .ForPath(dest => dest.Recurrence.RRule, src => src.MapFrom(x => x.RecurrenceGroup.Rrule))
                .ForPath(dest => dest.Recurrence.GroupId, src => src.MapFrom(x => x.RecurrenceGroup.PublicId));


            CreateMap<Appointment, AppointmentViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                /*
                .ForMember(dest => dest.Observations,
                    src => src.MapFrom(
                        x => x.AppointmentNotes.Where(n => n.NoteType == NoteType.Observation.ToString())))
                .ForMember(dest => dest.TreatmentNotes,
                    src => src.MapFrom(x =>
                        x.AppointmentNotes.Where(n => n.NoteType == NoteType.TreatmentNote.ToString())))
                .ForMember(dest => dest.Assessments,
                    src => src.MapFrom(x =>
                        x.AppointmentNotes.Where(n => n.NoteType == NoteType.Assessment.ToString())))
                        */
                .ForMember(dest => dest.AppointmentTypeId, src => src.MapFrom(x => x.AppointmentType.PublicId))
                .ForMember(dest => dest.Address, src => src.MapFrom(x => x.Address))
                .ForMember(dest => dest.Recurrence, config => config.MapFrom(source => source.RecurrenceGroup == null ? null: new AppointmentRecurrenceViewModel() ))
                .ForPath(dest => dest.Recurrence.isException, src => src.MapFrom(x => x.IsRecurrenceException))
                .ForPath(dest => dest.Recurrence.RRule, src => src.MapFrom(x => x.RecurrenceGroup.Rrule))
                .ForPath(dest => dest.Recurrence.GroupId, src => src.MapFrom(x => x.RecurrenceGroup.PublicId));


            CreateMap<TeamUser, ResourceViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.UserId))
                .ForMember(dest => dest.Title, src => src.MapFrom(x => x.User.FullName));

            CreateMap<Team, TeamResourceViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Title, src => src.MapFrom(x => x.Name))
                .ForMember(dest => dest.Children, src => src.MapFrom(x => x.Users));

            CreateMap<User, AppointmentListGridViewModel>()
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.FirstName))
                .ForMember(dest => dest.Events, src => src.MapFrom(x => x.Appointments));

            CreateMap<AppointmentType, AppointmentTypeViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<Appointment, AppointmentDetailsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PractitionerName, src => src.MapFrom(x => x.Practitioner.FullName))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.PractitionerId, src => src.MapFrom(x => x.Practitioner.Id))
                .ForMember(dest => dest.PatientName, src => src.MapFrom(x => x.PatientRecord.Patient.User.FullName))
                .ForMember(dest => dest.PatientContactNo,
                    src => src.MapFrom(x => x.PatientRecord.Patient.User.PhoneNumber))
                .ForMember(dest => dest.PatientEmail, src => src.MapFrom(x => x.PatientRecord.Patient.User.Email))
                .ForMember(dest => dest.CarePlanName,
                    src => src.MapFrom(x => x.TimeEntries.FirstOrDefault().Careplan.Title))
                .ForMember(dest => dest.TimeEntries, src => src.MapFrom(x => x.TimeEntries))
                .ForMember(dest => dest.TotalCost,
                    src => src.MapFrom(x => x.TimeEntries.Sum(t => t.BillableItems.Where(b=>b.BillableItem.IsBillable).Sum(b => b.Cost))))
                .ForMember(dest => dest.AppointmentType, src => src.MapFrom(x => x.AppointmentType.Name))
                .ForMember(dest => dest.Address, src => src.MapFrom(x => x.Address))
                .ForMember(dest => dest.InternalNote, src => src.MapFrom(x => x.InternalNote.Text))
                .ForMember(dest => dest.ExternalNote, src => src.MapFrom(x => x.ExternalNote.Text))

                .ForPath(dest => dest.Recurrence.RRule, src => src.MapFrom(x => x.RecurrenceGroup.Rrule))
                .ForPath(dest => dest.Recurrence.GroupId, src => src.MapFrom(x => x.RecurrenceGroup.PublicId));

            CreateMap<UpdateAppointmentRequestViewModel, CreateAppointmentRequestViewModel>();

        }
    }
}