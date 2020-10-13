using System;
using System.Globalization;
using System.IO;
using System.Text;
using System.Threading.Tasks;
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
    public class ProviderController : ParentController
    {
        private readonly IBillingService _billingService;
        private readonly IProviderService _providerService;

        public ProviderController(IProviderService providerService, IBillingService billingService)
        {
            _providerService = providerService;
            _billingService = billingService;
        }


        #region Reporting

        [HttpGet("{providerId}/report")]
        [Authorize(Policy = UserAction.Statement.Read)]
        public IActionResult DownloadReport(Guid providerId, [FromQuery] DateTime dateFrom, [FromQuery] DateTime dateTo)
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

        #region Provider

        //[Route("")]
        //[HttpPost]
        //public IActionResult CreateProvider(ProviderRequestViewModel model)
        //{
        //    return Ok(_providerService.CreateProvider(CurrentUserId(),  model)) ;
        //}

        //[Route("{providerId}")]
        //[HttpPut]
        //[Authorize(Policy = UserAction.Provider.Update)]
        //public IActionResult UpdateProvider(Guid providerId, ProviderRequestViewModel model)
        //{
        //    return Ok(_providerService.UpdateProvider(CurrentUserId(), providerId, model));
        //}

        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Provider.Read)]
        public IActionResult ListProvider(DataRequestModel dataRequest)
        {
            return Ok(_providerService.ListProvider(CurrentUserId(), dataRequest));
        }

        [Route("registrationComplete")]
        [HttpPost]
        public async Task<IActionResult> RegistrationComplete(ProviderRegistrationCompleteViewModel model)
        {
            return Ok(await _providerService.RegistrationComplete(CurrentUserId(), model));
        }

        [Route("")]
        [HttpGet]
        [Authorize(Policy = UserAction.Provider.Read)]
        public IActionResult GetProviderDetails()
        {
            return Ok(_providerService.GetProviderDetails(CurrentUserId()));
        }

        [Route("update")]
        [Authorize(Policy = UserAction.Provider.Update)]
        [HttpPost]
        public IActionResult UpdateBusinessProfile(ProviderUpdateRequestViewModel model)
        {
            return Ok(_providerService.UpdateBusinessProfile(CurrentUserId(), model));
        }

        #endregion
    }
}