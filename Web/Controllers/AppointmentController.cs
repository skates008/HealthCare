using System;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ParentController
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IBillingService _billingService;

        public AppointmentController(IAppointmentService appointmentService, IBillingService billingService)
        {
            _appointmentService = appointmentService;
            _billingService = billingService;
        }

        #region Appointment

        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.Appointment.Create)]
        public IActionResult CreateAppointment(CreateAppointmentRequestViewModel model)
        {
            return Ok(_appointmentService.CreateAppointment(CurrentUserId(), model));
        }

        [Route("pendinglist")]
        [HttpPost]
        [Authorize(Policy = UserAction.Appointment.Read)]
        public IActionResult ListPendingAppointment()
        {
            return Ok(_appointmentService.ListPendingAppointment(CurrentUserId()));
        }

        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Appointment.Read)]
        public IActionResult ListAppointment(AppointmentListRequestViewModel model)
        {
            return Ok(_appointmentService.ListAppointmentByDate(CurrentUserId(), model));
        }

        [Route("list/upcoming")]
        [HttpPost]
        [Authorize(Policy = UserAction.Appointment.Read)]
        public IActionResult ListUpcomingAppointment()
        {
            return Ok(_appointmentService.ListUpcomingAppointment(CurrentUserId()));
        }


        [Route("{appointmentId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Appointment.Read)]
        public IActionResult GetAppointmentById(Guid appointmentId)
        {
            return Ok(_appointmentService.GetAppointmentById(CurrentUserId(), appointmentId));
        }

        //For appointment details page
        [Route("{appointmentId}/details")]
        [HttpGet]
        [Authorize(Policy = UserAction.Appointment.Read)]
        public IActionResult GetAppointmentDetailsById(Guid appointmentId)
        {
            return Ok(_appointmentService.GetAppointmentDetailsById(CurrentUserId(), appointmentId));
        }

        [Route("{appointmentId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Appointment.Update)]
        public IActionResult UpdateAppointment(Guid appointmentId, UpdateAppointmentRequestViewModel model)
        {
            model.AppointmentId = appointmentId;
            return Ok(_appointmentService.UpdateAppointment(CurrentUserId(), model));
        }

        /*
        [Route("{appointmentId}/observation")]
        [HttpPost]
        [Authorize(Policy = UserAction.AppointmentObservation.Create)]
        public IActionResult SaveObservation(Guid appointmentId, SaveObservationViewModel model)
        {
            model.AppointmentId = appointmentId;
            return Ok(_appointmentService.SaveObservation(CurrentUserId(), model));
        }

        [Route("{appointmentId}/assessment")]
        [HttpPost]
        [Authorize(Policy = UserAction.AppointmentAssessment.Create)]
        public IActionResult SaveAssessment(Guid appointmentId, SaveAssessmentViewModel model)
        {
            model.AppointmentId = appointmentId;
            return Ok(_appointmentService.SaveAssessment(CurrentUserId(), model));
        }

        [Route("{appointmentId}/treatmentnote")]
        [HttpPost]
        [Authorize(Policy = UserAction.AppointmentTreatmentNote.Create)]
        public IActionResult SaveTreatmentNote(Guid appointmentId, SaveTreatmentNoteViewModel model)
        {
            model.AppointmentId = appointmentId;
            return Ok(_appointmentService.SaveTreatmentNote(CurrentUserId(), model));
        }
        */

        [Route("{appointmentId}/action")]
        [HttpPost]
        [Authorize(Policy = UserAction.Appointment.Update)]
        public IActionResult PerformAppointmentAction(Guid appointmentId, AppointmentActionRequestViewModel model)
        {
            model.Id = appointmentId;

            switch (model.Action)
            {
                case AppointmentAction.Accept:
                case AppointmentAction.Reject:
                case AppointmentAction.Cancel:
                    return Ok(_appointmentService.UpdateAppointmentStatus(CurrentUserId(), model));
                case AppointmentAction.Reschedule:
                    return Ok(_appointmentService.RescheduleAppointment(CurrentUserId(), model));
                case AppointmentAction.Finalize:
                    return Ok(_appointmentService.FinalizeAppointment(CurrentUserId(), model));
                case AppointmentAction.CheckIn:
                    return Ok(_appointmentService.CheckInAppointment(CurrentUserId(), model));
                case AppointmentAction.CheckOut:
                    return Ok(_appointmentService.CheckOutAppointment(CurrentUserId(), model));
                case AppointmentAction.InternalNote:
                    return Ok(_appointmentService.SaveInternalNote(CurrentUserId(), model));
            }

            return Ok();
        }

        [Route("list/timelineview")]
        [HttpPost]
        public IActionResult ListAppointmentTimeLineView(AppointmentListRequestViewModel model)
        {
            return Ok(_appointmentService.ListAppointmentTimeLineView(CurrentUserId(), model));
        }

        [Route("list/gridview")]
        [HttpPost]
        public IActionResult ListAppointmentGridView(AppointmentListRequestViewModel model)
        {
            return Ok(_appointmentService.ListAppointmentGridView(CurrentUserId(), model));
        }

        #endregion

        #region Time Entry

        [Route("{appointmentId}/timeEntry")]
        [HttpPost]
        [Authorize(Policy = UserAction.TimeEntry.Create)]
        public IActionResult CreateTimeEntry(Guid appointmentId, TimeEntryRequestViewModel model)
        {
            model.AppointmentId = appointmentId;
            return Ok(_billingService.CreateTimeEntry(CurrentUserId(), model));
        }

        [Route("{appointmentId}/timeEntry/{timeEntryId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.TimeEntry.Update)]
        public IActionResult UpdateTimeEntry(Guid appointmentId, Guid timeEntryId, TimeEntryRequestViewModel model)
        {
            model.AppointmentId = appointmentId;
            return Ok(_billingService.UpdateTimeEntry(CurrentUserId(), appointmentId, timeEntryId, model));
        }

        [Route("{appointmentId}/timeEntry")]
        [HttpGet]
        [Authorize(Policy = UserAction.TimeEntry.Read)]
        public IActionResult GetTimeEntries(Guid appointmentId, DataRequestModel dataRequest)
        {
            return Ok(_billingService.GetAppointmentTimeEntries(CurrentUserId(), appointmentId, dataRequest));
        }

        [Route("{appointmentId}/timeEntry/{timeEntryId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.TimeEntry.Read)]
        public IActionResult GetAppointmentTimeEntry(Guid appointmentId, Guid timeEntryId)
        {
            return Ok(_billingService.GetTimeEntry(CurrentUserId(), timeEntryId));
        }

        #endregion
    }
}