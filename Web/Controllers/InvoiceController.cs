using System;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ParentController
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.Invoice.Create)]
        public IActionResult CreateInvoice(InvoiceCreateViewModel model)
        {
            return Ok(_invoiceService.CreateInvoice(CurrentUserId(), model));
        }

        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Invoice.Read)]
        public IActionResult GetInvoices(DataRequestModel dataRequest)
        {
            return Ok(_invoiceService.GetInvoices(CurrentUserId(), dataRequest));
        }

        [Route("{invoiceId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Invoice.Read)]
        public IActionResult GetInvoice(Guid invoiceId)
        {
            return Ok(_invoiceService.GetInvoice(CurrentUserId(), invoiceId));
        }


        [Route("{invoiceId}/email")]
        [HttpPost]
        [Authorize(Policy = UserAction.Invoice.Create)]
        public IActionResult TriggerInvoiceEmail(Guid invoiceId)
        {
            //To be reviewd when refactoring the api.
            //an alternative to this could be ("more rest"): POST /invoice/invoiceId {action:triggerEmail}
            return Ok(_invoiceService.TriggerInvoiceEmail(CurrentUserId(), invoiceId));
        }


        [Route("bulkpaymentrequest")]
        [HttpGet]
        [Authorize(Policy = UserAction.Invoice.Read)]
        public IActionResult GetBulkPaymentRequest([FromQuery(Name = "agency")] string agency,
            [FromQuery(Name = "datefrom")] DateTime dateFrom, [FromQuery(Name = "dateto")] DateTime dateTo)
        {
            var csvFile = _invoiceService.GetBulkPaymentRequest(CurrentUserId(), agency, dateFrom, dateTo);
            return File(csvFile.FileContents, "application/octet-stream", csvFile.Filename);
        }
    }
}