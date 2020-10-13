using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Constant;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using CareTaskr.Service.Reporting;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CareTaskr.Service.Service
{
    public class InvoiceService : ParentService, IInvoiceService
    {
        private readonly IConverter _converter;
        private readonly IEmailService _emailService;

        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;
        private readonly ViewRender _viewRender;
        private readonly CareTaskrUrl _careTaskrUrls;

        public InvoiceService(IGenericUnitOfWork genericUnitOfWork, IMapper mapper, IFileService fileService,
            IEmailService emailService, ViewRender viewRender, IConverter converter, IOptions<CareTaskrUrl> careTaskrUrls) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
            _viewRender = viewRender;
            _fileService = fileService;
            _emailService = emailService;
            _converter = converter;
            _careTaskrUrls = careTaskrUrls.Value;
        }


        #region Invoicing

        private Invoice GetInvoice(Appointment appointment)
        {
            if (appointment != null)
            {
                if (!appointment.TimeEntries.Any()) throw new Exception("No time entries found!");
                return GetInvoice(appointment.PatientRecord, appointment.TimeEntries.ToList(),
                    appointment.TimeEntries.First().Careplan);
            }

            return null;
        }

        private Invoice GetInvoice(TimeEntry timeEntry)
        {
            if (timeEntry != null)
                return GetInvoice(timeEntry.Careplan.PatientRecord, new List<TimeEntry> {timeEntry},
                    timeEntry.Careplan);
            return null;
        }


        private BillingRun ExecuteBillingRun(Provider provider)
        {
            //TODO: pick billing run to execute
            var billingRun = provider.BillingRuns.FirstOrDefault(x => x.Status == BillingRunStatus.SCHEDULED);
            billingRun.Status = BillingRunStatus.RUNNING;
            billingRun.ModifiedDate = GeneralService.CurrentDate;
            billingRun = UpdateEntity<BillingRun, int>(billingRun);

            try
            {
                foreach (var patientRecord in provider.PatientRecords)
                    GenerateInvoicesForPatienRecord(billingRun, patientRecord);
                billingRun.Status = BillingRunStatus.SUCCESS;
                billingRun.ModifiedDate = GeneralService.CurrentDate;
                billingRun = UpdateEntity<BillingRun, int>(billingRun);
            }
            catch (Exception ex)
            {
                billingRun.Status = BillingRunStatus.FAILED;
                billingRun.ModifiedDate = GeneralService.CurrentDate;
                billingRun.Observations = ex.Message;
                UpdateEntity<BillingRun, int>(billingRun);

                //TODO: delete creted invoices?? maybe not
            }


            ScheduleNextBillingRun(provider);
            return billingRun;
        }


        private BillingRun ScheduleNextBillingRun(Provider provider)
        {
            //TEST FOR TIMEZONES - different providers might have differnt timezones

            var today = GeneralService.CurrentDate;

            //check for last successfull billing run
            var lastBillingRun = provider.BillingRuns.FirstOrDefault(x => x.Status == BillingRunStatus.SUCCESS);
            var lastRunDate = lastBillingRun != null ? lastBillingRun.ExecutionDate : today;


            //cancel schedulled billing run
            var scheduledBillingRun = provider.BillingRuns.FirstOrDefault(x => x.Status == BillingRunStatus.SCHEDULED);
            if (scheduledBillingRun != null)
            {
                scheduledBillingRun.Status = BillingRunStatus.CANCELLED;
                UpdateEntity<BillingRun, int>(scheduledBillingRun);
                //TODO: cancel scheduled system job
            }

            //calculate the date for the next run
            var nextRunDate = today;
            var billingSettings = provider.BillingSettings;
            switch (billingSettings.BillingCycle)
            {
                case BillingCycle.MONTHLY:
                {
                    nextRunDate = new DateTime(today.Year, today.Month, billingSettings.BillingDayOfMonth);
                    if (today.Day > billingSettings.BillingDayOfMonth) nextRunDate.AddMonths(1); //runs only next month
                    break;
                }
                case BillingCycle.WEEKLY:
                {
                    //add weeks
                    nextRunDate = lastRunDate.AddDays(7 * billingSettings.BillingWeekCycle);
                    //force day of week
                    nextRunDate.AddDays(billingSettings.BillingDayOfWeek - nextRunDate.DayOfWeek);
                    break;
                }
            }

            //set time of day
            var timeOfDay = Convert.ToDateTime(billingSettings.BillingTimeOfDay);
            nextRunDate = new DateTime(nextRunDate.Year, nextRunDate.Month, nextRunDate.Day, nextRunDate.Hour,
                nextRunDate.Minute, 0);

            //check if calculated date is in the past, if it is, run today!
            if (nextRunDate < today) nextRunDate = today;

            //schedule new billing run
            scheduledBillingRun = new BillingRun(provider.BillingSettings, nextRunDate);
            AddEntity<BillingRun, int>(scheduledBillingRun);

            //TODO: schedule system job
            return scheduledBillingRun;
        }


        //invoice any timeentries not yet billed
        private List<Invoice> GenerateInvoicesForPatienRecord(BillingRun billingRun, PatientRecord patientRecord)
        {
            var invoiceLst = new List<Invoice>();
            //
            var repo = _genericUnitOfWork.GetRepository<TimeEntryBillableItem, int>();
            var timeEntriesPerCarePlan = repo.GetAll()
                .Where(x => x.InvoiceItem == null && x.TimeEntry.Careplan.PatientRecord == patientRecord)
                .Select(x => x.TimeEntry).Distinct().ToList().GroupBy(x => x.Careplan).Distinct();

            foreach (var result in timeEntriesPerCarePlan)
            {
                var careplan = result.Key;
                var timeEntryLst = result.ToList();
                var invoice = GetInvoice(patientRecord, timeEntryLst, careplan);
                invoice = SaveInvoice(InvoiceTriggerType.INVOCE_RUN, invoice, Guid.Empty, billingRun);
            }

            return invoiceLst;
        }

        private Invoice GetInvoice(PatientRecord patientRecord, List<TimeEntry> timeEntryLst, Careplan careplan)
        {
            if (timeEntryLst != null && timeEntryLst.Any())
            {
                var invoice = new Invoice(patientRecord, careplan);
                foreach (var timeEntry in timeEntryLst)
                {
                    var isBillable = timeEntry.Appointment?.AppointmentType?.IsBillable;
                    if (isBillable == null) isBillable = true; //by default assume it is billable

                    invoice.AddItems(timeEntry.TimeEntryBillableItems, (bool) isBillable);
                }

                return invoice;
            }

            return null;
        }

        private Invoice SaveInvoice(InvoiceTriggerType triggerType, Invoice invoice, Guid currentUserId,
            BillingRun billingRun = null)
        {
            if (invoice != null)
            {
                //validate if there are timeentries to be invoiced
                if (!invoice.InvoiceItems.Any()) throw new Exception("No Items to be invoiced.");
                //validade if any of the timeentries has already been invoiced
                if (invoice.InvoiceItems.Count(x => x.TimeEntryBillableItem.InvoiceItem != null) > 0)
                    throw new Exception("One or more items have already been invoiced.");
                //validade if any of the timeentries has already been invoiced
                var currentTime = GeneralService.CurrentDate;
                if (invoice.InvoiceItems.Count(x => x.Date > currentTime) > 0)
                    throw new Exception("Cannot invoice time entries in the future");
                //validate if there are timeentries from different careplans
                if (invoice.InvoiceItems.Select(x => x.TimeEntryBillableItem.TimeEntry.Careplan).Distinct().Count() > 1)
                    throw new Exception("Some items belong to different careplans.");

                invoice.TriggerType = triggerType;
                if (triggerType == InvoiceTriggerType.INVOCE_RUN)
                    invoice.BillingRun = billingRun;
                else if (triggerType == InvoiceTriggerType.ADHOC) invoice.CreatedById = currentUserId;
                invoice.CreatedDate = GeneralService.CurrentDate;

                invoice.Reference =
                    GetNextInvoiceReference(invoice
                        .Provider); //TODO: carefull with concurrent requests!!!! rethink later //maybe try catch and retry!?
                var filename = $"{invoice.Provider.CompanyName}-{invoice.Reference}.pdf".Trim();

                //TODO:update invoice view & use trigger Type to get the proper invoice layout

                //create pdf and upload pdf file
                var invoiceHtml = _viewRender.Render("PdfTemplate/Invoice", invoice);
                var byteArray = PDFBuilder.ConvertHtmltoPdf(_converter, invoiceHtml);

                var fileName = $"{invoice.Provider.CompanyName}-{invoice.Reference}.pdf";

                //TODO: store files as a different entity

                invoice.File = _fileService.Upload(
                                currentUserId, 
                                invoice.Careplan.PatientRecord,
                                GenerateUploadModel(invoice.Reference, fileName, byteArray), 
                                PatientRecordFileType.Invoice);


                AddEntity<Invoice, int>(invoice);

                TriggerEmail(invoice);
            }

            return invoice;
        }

        private FileUploadRequestViewModel GenerateUploadModel(string name, string filename, byte[] byteArray)
        {
            var stream = new MemoryStream(byteArray);
            IFormFile file = new FormFile(stream, 0, byteArray.Length, name, filename);

            return new FileUploadRequestViewModel()
            {
                File = file,
                Filename = filename,
                MimeType = "application/pdf",
                Title = name
            };

        }

        private string GetNextInvoiceReference(Provider provider)
        {
            //reference format must be eg: INV(00000)
            var referenceFormat = provider.BillingSettings.InvoiceReferenceFormat;
            var idIndexStart = referenceFormat.IndexOf("(");
            var idIndexEnd = referenceFormat.IndexOf(")");
            var idSize = idIndexEnd - idIndexStart - 1;

            var totalIssuedInvoices = provider.Invoices.Count;
            var id = (totalIssuedInvoices + 1).ToString().PadLeft(idSize, '0');

            return $"{referenceFormat.Substring(0, idIndexStart)}{id}";
        }


        private async void TriggerEmail(Invoice invoice)
        {
            //in the future create a queue mechanism to proccess async requests (emails, sms, notifications, etc etc)

            var email = invoice.Careplan.PatientRecord.BillingDetails?.Email;
            if (email == null) email = invoice.Careplan.PatientRecord.Patient.User.Email;

            invoice.DownloadPdfUrl = _fileService.GetContainerSasUri(invoice.File.FileUpload.Filename);
            //var html = _viewRender.Render(EmailTemplate.INVOICE_NEW, invoice);
            //await _emailService.SendEmailAsync(email, $"Caretaskr: Invoice:{invoice.Reference}", html);
            var data = new
            {
                DownloadPdfUrl = invoice.DownloadPdfUrl,
                CustomerName = invoice.CustomerName,
                Reference = invoice.Reference,
                LogoUrl = _careTaskrUrls.WebUrl + ImageConstant.LOGO_URL,
                WebUrl = _careTaskrUrls.WebUrl
            };

            await _emailService.SendEmailDynamicTemplate(email, SENDGRIDEMAILTEMPLATE.VIEW_INVOICE, data);
        }


        public ResponseViewModel CreateInvoice(Guid currentUserId, InvoiceCreateViewModel model)
        {
            var invoices = new List<Invoice>();

            if (model.InvoiceRunId != null)
            {
                var invoiceRun = GetEntity<BillingRun, int>((Guid) model.InvoiceRunId);
            }
            else if (model.AppointmentId != null)
            {
                var appointment = GetEntity<Appointment, int>((Guid) model.AppointmentId);
                var invoice = GetInvoice(appointment);
                invoice = SaveInvoice(InvoiceTriggerType.ADHOC, invoice, currentUserId);
                invoices.Add(invoice);
            }
            else if (model.TimeEntryId != null)
            {
                var timeEntry = GetEntity<TimeEntry, int>((Guid) model.TimeEntryId);
                var invoice = GetInvoice(timeEntry);
                invoice = SaveInvoice(InvoiceTriggerType.ADHOC, invoice, currentUserId);
                invoices.Add(invoice);
            }

            return new ResponseViewModel<List<InvoiceViewModel>>
                {Data = _mapper.Map<List<InvoiceViewModel>>(invoices), Success = true};
        }

          public DataSourceResult GetInvoices(Guid currentUserId, DataRequestModel dataRequest)
        {
            var user = GetUser(currentUserId);

            var queryable = _genericUnitOfWork.GetRepository<Invoice, Guid>().GetAll();

            switch (user.UserType)
            {
                case UserType.Manager:
                case UserType.Owner:
                    //nothing to do, already filtered by provided
                    break;
                case UserType.User:
                    //TODO: only invoices for entries created by user

                    break;
                case UserType.Client:
                case UserType.ClientCustodian:
                case UserType.PrimaryCustodian:
                    throw new Exception("not implemented");
            }

            if (dataRequest.Filter != null)
                /*
                    var reference = dataRequest.Filter.ContainsKey(Constants.QueryFilters.INOVOCE_REFERENCE) ? dataRequest.Filter[Constants.QueryFilters.INOVOCE_REFERENCE] : String.Empty;
                    var customerName = dataRequest.Filter.ContainsKey(Constants.QueryFilters.PATIENT_NAME) ? dataRequest.Filter[Constants.QueryFilters.PATIENT_NAME] : String.Empty;
                    var customerNDISNumber = dataRequest.Filter.ContainsKey(Constants.QueryFilters.PATIENT_NDIS_NUMBER) ? dataRequest.Filter[Constants.QueryFilters.PATIENT_NDIS_NUMBER] : String.Empty;
                    var serviceBookingReference = dataRequest.Filter.ContainsKey(Constants.QueryFilters.SERVICE_BOOKING_REFERENCE) ? dataRequest.Filter[Constants.QueryFilters.SERVICE_BOOKING_REFERENCE] : String.Empty;
    */
                if (dataRequest.Filter.ContainsKey("name") && dataRequest.Filter["name"] != null)
                {
                    var q = dataRequest.Filter["name"];

                    queryable = queryable.Where(p => p.Reference.Contains(q) ||
                                                     p.CustomerName.Contains(q) ||
                                                     p.Careplan.ServiceBookingReference.Contains(q) ||
                                                     p.Careplan.PatientRecord.Patient.NDISNumber.Contains(q));
                }


        

            var result = queryable.ToDataSourceResult<Invoice, InvoiceListViewModel>(_mapper, dataRequest,
                       new Sort { Field = "CreatedDate", Direction = SortOrder.DESCENDING });
            return result;
        }

        public ResponseViewModel GetInvoice(Guid currentUserId, Guid id)
        {
            //TODO: check if user can access this invoice
            var invoice = GetEntity<Invoice, int>(id);
            return new ResponseViewModel<InvoiceViewModel>
                {Data = _mapper.Map<InvoiceViewModel>(invoice), Success = true};
        }

        public ResponseViewModel TriggerInvoiceEmail(Guid guid, Guid invoiceId)
        {
            var invoice = GetEntity<Invoice, int>(invoiceId);
            TriggerEmail(invoice);
            return new ResponseViewModel<bool> {Data = true, Success = true};
        }

        public CsvFile<BulkPaymentRequestItem> GetBulkPaymentRequest(Guid currentUserId, string agency,
            DateTime dateFrom, DateTime dateTo)
        {
            //TODO: check time on datetimes
            var queryable = _genericUnitOfWork.GetRepository<InvoiceItem, Guid>().GetAll().Where(x =>
                x.Invoice.Type == BillingType.AGENCY_MANAGED &&
                x.Date.Date >= dateFrom.Date &&
                x.Date.Date <= dateTo.Date
            ).OrderBy(x => x.Date).AsQueryable();

            if (!queryable.Any()) throw new Exception("No items found");

            var items = new List<BulkPaymentRequestItem>();

            foreach (var invoiceItem in queryable.ToList()) items.Add(new BulkPaymentRequestItem(invoiceItem));


            var filename =
                $"{agency.ToUpper()}-Bulk-Payment-Request-{GeneralService.CurrentDate.ToString("yyyy-MM-dd HH:mm")}.csv";

            return new CsvFile<BulkPaymentRequestItem>(items, filename);
        }

        #endregion
    }
}