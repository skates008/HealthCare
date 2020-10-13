using System;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TimeEntryController : ParentController
    {
        private readonly IBillingService _billingService;

        public TimeEntryController(IBillingService billingService)
        {
            _billingService = billingService;
        }


        #region Time Entry

        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.TimeEntry.Read)]
        public IActionResult GetTimeEntries(DataRequestModel dataRequest)
        {
            return Ok(_billingService.GetTimeEntries(CurrentUserId(), dataRequest));
        }

        [Route("{timeEntryId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.TimeEntry.Read)]
        public IActionResult GetAppointmentTimeEntry(Guid timeEntryId)
        {
            return Ok(_billingService.GetTimeEntry(CurrentUserId(), timeEntryId));
        }

        [Route("{timeEntryId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.TimeEntry.Delete)]
        public IActionResult DeleteTimeEntry(Guid timeEntryId)
        {
            return Ok(_billingService.DeleteTimeEntry(CurrentUserId(), timeEntryId));
        }


        [Route("{timeEntryId}/billableItem/{billableItemId}")]
        [HttpDelete]
        public IActionResult DeleteTimeEntryBillableItem(Guid timeEntryId, Guid billableItemId)
        {
            return Ok(_billingService.DeleteTimeEntryBillableItem(CurrentUserId(), timeEntryId, billableItemId));
        }

        #endregion


        #region My Statement

        [Route("mystatement/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Statement.Read)]
        public IActionResult ListStatements(DataRequestModel dataRequest)
        {
            return Ok(_billingService.ListStatements(CurrentUserId(), dataRequest));
        }

        [Route("{timeEntryId}/mystatement")]
        [HttpGet]
        [Authorize(Policy = UserAction.Statement.Read)]
        public IActionResult GetTimeEntriesDetails(Guid timeEntryId)
        {
            return Ok(_billingService.GetTimeEntriesDetails(CurrentUserId(), timeEntryId));
        }

        #endregion
    }
}