using System;
using System.Collections.Generic;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IAppointmentService
    {
        ResponseViewModel CreateAppointment(Guid currentUserId, CreateAppointmentRequestViewModel model, AppointmentRecurrenceGroup reccurrenceGroup = null);
        ResponseViewModel<List<ListAppointmentResponseViewModel>> ListPendingAppointment(Guid currentUserId);

        ResponseViewModel<List<ListAppointmentResponseViewModel>> ListAppointmentByDate(Guid currentUserId,
            AppointmentListRequestViewModel model);

        ResponseViewModel<List<ListAppointmentResponseViewModel>> ListUpcomingAppointment(Guid currentUserId);

        ResponseViewModel RescheduleAppointment(Guid currentUserId, AppointmentActionRequestViewModel model);

        ResponseViewModel UpdateAppointmentStatus(Guid currentUserId, AppointmentActionRequestViewModel model);

        ResponseViewModel<AppointmentResponseViewModel>
            GetAppointmentById(Guid currentUserId, Guid appointmentPublicId);

        ResponseViewModel<AppointmentDetailsViewModel> GetAppointmentDetailsById(Guid currentUserId,
            Guid appointmentPublicId);

        ResponseViewModel UpdateAppointment(Guid currentUserId, UpdateAppointmentRequestViewModel model);


    //    ResponseViewModel SaveObservation(Guid currentUserId, SaveObservationViewModel model);
    //    ResponseViewModel SaveAssessment(Guid currentUserId, SaveAssessmentViewModel model);
    //    ResponseViewModel SaveTreatmentNote(Guid currentUserId, SaveTreatmentNoteViewModel model);

        ResponseViewModel FinalizeAppointment(Guid currentUserId, AppointmentActionRequestViewModel model);

        ResponseViewModel CheckInAppointment(Guid currentUserId, AppointmentActionRequestViewModel model);
        ResponseViewModel CheckOutAppointment(Guid currentUserId, AppointmentActionRequestViewModel model);
        ResponseViewModel SaveInternalNote(Guid currentUserId, AppointmentActionRequestViewModel model);


        ResponseViewModel<List<ListAppointmentResponseViewModel>> ListAppointmentTimeLineView(Guid currentUserId,
            AppointmentListRequestViewModel model);

        ResponseViewModel<List<AppointmentListGridViewModel>> ListAppointmentGridView(Guid currentUserId,
            AppointmentListRequestViewModel model);
    }
}