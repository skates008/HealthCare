using System;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CareplanController : ParentController
    {
        private readonly IBillingService _billingService;
        private readonly IPatientService _patientService;

        public CareplanController(IBillingService billingService, IPatientService patientService)
        {
            _billingService = billingService;
            _patientService = patientService;
        }


        #region Time Entry

        [Route("{careplanId}/timeEntry")]
        [HttpPost]
        [Authorize(Policy = UserAction.TimeEntry.Create)]
        public IActionResult CreateTimeEntry(Guid careplanId, TimeEntryRequestViewModel model)
        {
            model.CareplanId = careplanId;
            return Ok(_billingService.CreateTimeEntry(CurrentUserId(), model));
        }

        [Route("{careplanId}/timeEntry/{timeEntryId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.TimeEntry.Update)]
        public IActionResult UpdateTimeEntry(Guid careplanId, Guid timeEntryId, TimeEntryRequestViewModel model)
        {
            model.CareplanId = careplanId;
            return Ok(_billingService.UpdateTimeEntry(CurrentUserId(), careplanId, timeEntryId, model));
        }

        [Route("{careplanId}/timeEntry")]
        [HttpGet]
        [Authorize(Policy = UserAction.TimeEntry.Read)]
        public IActionResult GetTimeEntries(Guid careplanId, DataRequestModel dataRequest)
        {
            return Ok(_billingService.GetCareplanTimeEntries(CurrentUserId(), careplanId, dataRequest));
        }

        [Route("{careplanId}/timeEntry/{timeEntryId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.TimeEntry.Read)]
        public IActionResult GetAppointmentTimeEntry(Guid careplanId, Guid timeEntryId)
        {
            return Ok(_billingService.GetTimeEntry(CurrentUserId(), timeEntryId));
        }


        [Route("import")]
        [HttpPost]
        public IActionResult ImportCarePlan(CarePlanImportRequestViewModel model)
        {
            return Ok(_patientService.ImportCarePlan(model.Source));
        }

        #endregion

        //list patient by therapist associated to careplan
        [Route("patient/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult ListPatientByCareplan(DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListPatientByCareplan(CurrentUserId(), dataRequest));
        }
    }
}