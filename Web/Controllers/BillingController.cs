using System;
using System.Globalization;
using System.IO;
using System.Text;
using CareTaskr.Authorization;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using CareTaskr.Service.Reporting;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BillableItemController : ParentController
    {
        private readonly IBillingService _billingService;

        public BillableItemController(IBillingService billingService)
        {
            _billingService = billingService;
        }

        #region Reporting

        [HttpGet("report")]
        [Authorize(Policy = UserAction.Statement.Read)]
        public IActionResult DownloadReport([FromQuery] Guid providerId, [FromQuery] DateTime dateFrom,
            [FromQuery] DateTime dateTo)
        {
            var data = _billingService.GetTimeEntryReport(CurrentUserId(), providerId, dateFrom, dateTo);

            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream, Encoding.UTF8, 1024, true);
            var csvWriter = new CsvWriter(writer, CultureInfo.InvariantCulture);


            csvWriter.Configuration.Delimiter = ",";
            csvWriter.Configuration.HasHeaderRecord = true;
            csvWriter.Configuration.AutoMap<TimeEntryReport>();

            csvWriter.WriteHeader<TimeEntryReport>();
            csvWriter.NextRecord();
            csvWriter.WriteRecords(data);

            writer.Flush();
            var arr = memoryStream.ToArray();

            return File(arr, "application/octet-stream",
                $"Report-{GeneralService.CurrentDate.ToString("yyyy-MM-dd HH:mm")}.csv");
        }

        #endregion


        #region Billable Item

        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.BillableItem.Create)]
        public IActionResult CreateBillableItem(BillableItemRequestViewModel model)
        {
            return Ok(_billingService.CreateBillableItem(CurrentUserId(), model));
        }

        [Route("{billableItemId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.BillableItem.Update)]
        public IActionResult UpdateBillableItem(Guid billableItemId, BillableItemRequestViewModel model)
        {
            return Ok(_billingService.UpdateBillableItem(CurrentUserId(), billableItemId, model));
        }

        [Route("{billableItemId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.BillableItem.Read)]
        public IActionResult GetBillableItem(Guid billableItemId)
        {
            return Ok(_billingService.GetBillableItem(CurrentUserId(), billableItemId));
        }

        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.BillableItem.Read)]
        public IActionResult ListBillableItem(DataRequestModel dataRequest)
        {
            return Ok(_billingService.ListBillableItem(CurrentUserId(), dataRequest));
        }

        [Route("{billableItemId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.BillableItem.Delete)]
        public IActionResult DeleteBillableItem(Guid billableItemId)
        {
            return Ok(_billingService.DeleteBillableItem(CurrentUserId(), billableItemId));
        }

        #endregion
    }
}