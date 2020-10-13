using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using CareTaskr.Service.Reporting;
using DinkToPdf.Contracts;

namespace CareTaskr.Service.Service
{
    public class BillingService : ParentService, IBillingService
    {
        private readonly IConverter _converter;
        private readonly IEmailService _emailService;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly ViewRender _viewRender;

        public BillingService(IGenericUnitOfWork genericUnitOfWork, IMapper mapper, IEmailService emailService,
            ViewRender viewRender, IConverter converter) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
            _viewRender = viewRender;
            _emailService = emailService;
            _converter = converter;
        }


        public ICollection<TimeEntryReport> GetTimeEntryReport(Guid currentUserId, Guid providerId,
            DateTime dateTimeFrom, DateTime dateTimeTo)
        {
            //TODO: validate user permissions
            //TODO: dates and provider
            var queryable = _genericUnitOfWork.GetRepository<TimeEntryBillableItem, Guid>().GetAll().Where(x =>
                x.IsActive &&
                x.BillableItem.NDISNumber != string.Empty &&
                x.TimeEntry.StartTime > dateTimeFrom &&
                x.TimeEntry.StartTime < dateTimeTo
            ).OrderBy(x => x.TimeEntry.StartTime).AsQueryable();

            var timeEntryReportLst = new List<TimeEntryReport>();
            foreach (var timeEntryBillableItem in queryable.ToList())
                timeEntryReportLst.Add(new TimeEntryReport(timeEntryBillableItem));

            return timeEntryReportLst;
        }


        public Careplan EnrichWithFunds(Careplan careplan)
        {
            careplan.TotalBudget = GetTotalFunds(new List<Careplan> {careplan});
            careplan.RemainingFunds = GetRemainingFunds(new List<Careplan> {careplan});
            return careplan;
        }

        public decimal GetRemainingFunds(Careplan careplan)
        {
            return GetRemainingFunds(new List<Careplan> {careplan});
        }


        public decimal GetRemainingFunds(PatientRecord patientRecord)
        {
            var careplans = patientRecord.Careplans.Where(x => x.Status == CareplanStatus.Active).ToList();
            return GetRemainingFunds(careplans);
        }

        public ResponseViewModel DeleteTimeEntryBillableItem(Guid currentUserId, Guid timeEntryId, Guid billableItemId)
        {
            var repo = _genericUnitOfWork.GetRepository<TimeEntry, Guid>();
            var entity = repo.FirstOrDefault(x => x.PublicId == timeEntryId);
            if (entity == null)
                throw new ArgumentException("Time Entry Does not Exist");
            var timeEntryBillableItems =
                entity.TimeEntryBillableItems.FirstOrDefault(x => x.PublicId == billableItemId);

            if (timeEntryBillableItems == null)
                throw new ArgumentException("Time Entry BillableItem Does not Exist");


            timeEntryBillableItems.IsActive = false;
            timeEntryBillableItems.ModifiedById = currentUserId;
            timeEntryBillableItems.ModifiedDate = GeneralService.CurrentDate;


            repo.Update(entity);
            _genericUnitOfWork.SaveChanges();

            return new ResponseViewModel {Success = true};
        }

        private decimal GetTotalFunds(List<Careplan> careplans)
        {
            /*
            //TODO: optimize this (cache, or even store this somewhere and update as needed, add/edit timeentries)
            var totalAvailable = _genericUnitOfWork.GetRepository<FundedSupport, int>().GetAll()
                .Where(x => careplans.Contains(x.CarePlan)).Sum(x => x.FundAllocated);
            if (totalAvailable == null)
                totalAvailable = 0;
                */

            return careplans.Sum(x=> x.TotalBudget);
        }

        private decimal GetTotalSpent(List<Careplan> careplans)
        {
            decimal? totalSpent = _genericUnitOfWork.GetRepository<TimeEntryBillableItem, int>().GetAll()
                .Where(x => careplans.Contains(x.TimeEntry.Careplan)).ToList().Sum(x => x.GetTotal());
            if (totalSpent == null)
                totalSpent = 0;
            return (decimal) totalSpent;
        }

        private decimal GetRemainingFunds(List<Careplan> careplans)
        {
            //TODO: optimize this (cache, or even store this somewhere and update as needed, add/edit timeentries)
            return GetTotalFunds(careplans) - GetTotalSpent(careplans);
        }


        #region Billable Item

        public ResponseViewModel CreateBillableItem(Guid currentUserId, BillableItemRequestViewModel model)
        {
            return CreateUpdateBillableItem(currentUserId, model, Guid.Empty);
        }

        public ResponseViewModel UpdateBillableItem(Guid currentUserId, Guid billableItemPublicId,
            BillableItemRequestViewModel model)
        {
            return CreateUpdateBillableItem(currentUserId, model, billableItemPublicId);
        }

        private ResponseViewModel CreateUpdateBillableItem(Guid currentUserId, BillableItemRequestViewModel model,
            Guid billableItemPublicId)
        {
            var repo = _genericUnitOfWork.GetRepository<BillableItem, int>();
            BillableItem billableItem;

            if (billableItemPublicId != Guid.Empty)
            {
                //UPDATE
                billableItem = repo.FirstOrDefault(c => c.PublicId == billableItemPublicId);
                if (billableItem == null)
                    throw new ArgumentException("Billable Item does not exist");

                var nameExists = repo.GetAll(c => c.Name == model.Name && c.PublicId != billableItemPublicId);

                if (nameExists.Any())
                    throw new ArgumentException("Name already Exists");


                billableItem.ModifiedById = currentUserId;
                billableItem.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                var nameExists = repo.GetAll(c => c.Name == model.Name);

                if (nameExists.Any())
                    throw new ArgumentException("Name already Exists");

                billableItem = new BillableItem
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
            }

            billableItem.Provider = GetUserProvider(currentUserId);
            billableItem.IsBillable = model.IsBillable;
            billableItem.Name = model.Name;
            billableItem.Unit = (BillableItemUnit) model.Unit;
            if (billableItem.IsBillable)
            {
                billableItem.NDISNumber = model.NDISNumber;
                billableItem.Price = model.Price;
                billableItem.GSTCode = (BillableIteGSTCode) model.GSTCode;
            }
            else
            {
                billableItem.Price = 0;
            }

            billableItem.Description = model.Description;


            if (billableItemPublicId == Guid.Empty)
                repo.Add(billableItem);
            else
                repo.Update(billableItem);


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<BillableItemViewModel>
                {Data = _mapper.Map<BillableItemViewModel>(billableItem), Success = true};
        }

        public ResponseViewModel GetBillableItem(Guid currentUserId, Guid billableItemId)
        {
            //get user timeentries
            var provider = GetUserProvider(currentUserId);
            var repo = _genericUnitOfWork.GetRepository<BillableItem, Guid>();

            var billableItem = repo.FirstOrDefault(x => x.PublicId == billableItemId);

            return new ResponseViewModel<BillableItemDetailViewModel>
                {Data = _mapper.Map<BillableItemDetailViewModel>(billableItem), Success = true};
        }

        public DataSourceResult ListBillableItem(Guid currentUserId, DataRequestModel dataRequest)
        {
            var provider = GetUserProvider(currentUserId);

            Expression<Func<BillableItem, bool>> expression = c => c.IsActive && c.ProviderId == provider.Id;

            var queryable = _genericUnitOfWork.GetRepository<BillableItem, Guid>().GetAll(expression).AsQueryable();

            if (dataRequest.Filter != null)
                if (dataRequest.Filter.ContainsKey("name") && dataRequest.Filter["name"] != null)

                {
                    var filter = dataRequest.Filter["name"];
                    queryable = queryable.Where(p => p.Name.Contains(filter));
                }

            var result = queryable.ToDataSourceResult<BillableItem, BillableItemViewModel>(_mapper, dataRequest,
                new Sort {Field = "CreatedDate", Direction = SortOrder.DESCENDING});

            return result;
        }


        public ResponseViewModel DeleteBillableItem(Guid currentUserId, Guid publicId)
        {
            DeleteEntity<BillableItem, int>(currentUserId, publicId, "Billable Item");


            return new ResponseViewModel {Success = true};
        }

        public ResponseViewModel DeleteTimeEntry(Guid currentUserId, Guid publicId)
        {
            DeleteEntity<TimeEntry, int>(currentUserId, publicId, "Time Entry");


            return new ResponseViewModel {Success = true};
        }

        #endregion

        #region Time Entry

        public ResponseViewModel CreateTimeEntry(Guid currentUserId, TimeEntryRequestViewModel model)
        {
            return CreateUpdatetimeEntry(currentUserId, model, Guid.Empty);
        }

        public ResponseViewModel UpdateTimeEntry(Guid currentUserId, Guid appointmentId, Guid timeEntryPublicId,
            TimeEntryRequestViewModel model)
        {
            return CreateUpdatetimeEntry(currentUserId, model, timeEntryPublicId);
        }

        private ResponseViewModel CreateUpdatetimeEntry(Guid currentUserId, TimeEntryRequestViewModel model,
            Guid timeEntryPublicId)
        {
            //check for valid date
            var provider = GetUserProvider(currentUserId);
            if (model.BillableItems.Any(x =>
                x.StartTime > GeneralService.CurrentDate || x.StartTime < provider.CreatedDate))
                throw new Exception("Invalid date");

            var repo = _genericUnitOfWork.GetRepository<TimeEntry, int>();
            var repoTimeEntryBillableItem = _genericUnitOfWork.GetRepository<TimeEntryBillableItem, int>();
            var repoBillableItem = _genericUnitOfWork.GetRepository<BillableItem, int>();
            TimeEntry timeEntry;

            if (timeEntryPublicId != Guid.Empty)
            {
                //UPDATE
                timeEntry = repo.FirstOrDefault(c => c.PublicId == timeEntryPublicId);
                if (timeEntry == null)
                    throw new ArgumentException("Time Entry does not exists");

                timeEntry.ModifiedById = currentUserId;
                timeEntry.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                timeEntry = new TimeEntry
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
            }

            timeEntry.CarePlanId = GetInternalId<Careplan, int>(model.CareplanId);

            if (model.AppointmentId != Guid.Empty)
                timeEntry.AppointmentId = GetInternalId<Appointment, int>(model.AppointmentId);

            timeEntry.Name = model.Name;


            if (timeEntryPublicId == Guid.Empty)
                repo.Add(timeEntry);
            else
                repo.Update(timeEntry);


            //  _genericUnitOfWork.SaveChanges();

            if (timeEntry.BillableItems != null)
                foreach (var tebi in timeEntry.BillableItems)
                    repoTimeEntryBillableItem.Delete(tebi);

            timeEntry.BillableItems = new List<TimeEntryBillableItem>();
            foreach (var billableItem in model.BillableItems)
            {
                var costBillableItem = repoBillableItem.FirstOrDefault(x => x.PublicId == billableItem.Id);
                var timeEntryBillableItem = new TimeEntryBillableItem
                {
                    CreatedBy = GetUser(currentUserId),
                    CreatedDate = GeneralService.CurrentDate,
                    TimeEntry = timeEntry,
                    BillableItemId = GetInternalId<BillableItem, int>(billableItem.Id),
                    Quantity = (double) billableItem.Quantity,
                    StartTime = billableItem.StartTime,
                    Cost = billableItem.Quantity * Convert.ToDecimal(costBillableItem.Price)
                };
                repoTimeEntryBillableItem.Add(timeEntryBillableItem);
                timeEntry.BillableItems.Add(timeEntryBillableItem);
            }


            _genericUnitOfWork.SaveChanges();

            // only sending email while adding
            //if (timeEntryPublicId == Guid.Empty && timeEntry.BillableItems.Count > 0)
            //{
            //    var billableItemModel = _mapper.Map<List<BillableItemReportViewModel>>(timeEntry.BillableItems);
            //    var emailModel = new BillableItemNotificationViewModel
            //    {
            //        BillableItem = billableItemModel,
            //        CompanyName = timeEntry.Careplan.PatientRecord.Provider.Name,
            //        Address = timeEntry.Careplan.PatientRecord.Provider.BusinessAddress.Address,
            //        PhoneNumber = timeEntry.Careplan.PatientRecord.Provider.PhoneNumber
            //    };

            //    #region Send  Email

            //    var email = timeEntry.Careplan.PatientRecord.Patient.User.Email;

            //    var html = _viewRender.Render("EmailTemplate/BillableItems", emailModel);
            //    _emailService.SendEmailAsync(email, "CareTaskr : Billable Item ", html);

            //    #endregion
            //}

            return new ResponseViewModel<TimeEntryViewModel>
                {Data = _mapper.Map<TimeEntryViewModel>(timeEntry), Success = true};
        }


        public DataSourceResult GetAppointmentTimeEntries(Guid currentUserId, Guid appointmentId,
            DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<TimeEntry, Guid>().GetAll()
                .Where(x => x.Appointment.PublicId == appointmentId).AsQueryable();

            var result = queryable.ToDataSourceResult<TimeEntry, TimeEntryViewModel>(_mapper, dataRequest,
                new Sort {Field = "CreatedDate", Direction = SortOrder.DESCENDING});

            return result;
        }

        public DataSourceResult GetCareplanTimeEntries(Guid currentUserId, Guid careplanId,
            DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<TimeEntry, Guid>().GetAll()
                .Where(x => x.Careplan.PublicId == careplanId).AsQueryable();

            var result = queryable.ToDataSourceResult<TimeEntry, TimeEntryViewModel>(_mapper, dataRequest,
                new Sort {Field = "CreatedDate", Direction = SortOrder.DESCENDING});

            return result;
        }

        public ResponseViewModel GetTimeEntry(Guid currentUserId, Guid timeEntryPublicId)
        {
            //get user timeentries
            var provider = GetUserProvider(currentUserId);
            var repo = _genericUnitOfWork.GetRepository<TimeEntry, Guid>();

            var timeEntry = GetEntity<TimeEntry, int>(timeEntryPublicId);
            var result = _mapper.Map<TimeEntryViewModel>(timeEntry);

            //get invoice Data for appointment
            var invoice = _genericUnitOfWork.GetRepository<InvoiceItem, int>()
                .FirstOrDefault(x => x.TimeEntryBillableItem.TimeEntry == timeEntry)?.Invoice;
            if (invoice != null) result.Invoice = _mapper.Map<InvoiceListViewModel>(invoice);

            return new ResponseViewModel<TimeEntryViewModel> {Data = result, Success = true};
        }

        public DataSourceResult GetTimeEntries(Guid currentUserId, DataRequestModel dataRequest)
        {
            var provider = GetUserProvider(currentUserId);
            Expression<Func<TimeEntry, bool>> expression = c =>
                c.IsActive && c.Careplan.PatientRecord.Provider == provider;

            var queryable = _genericUnitOfWork.GetRepository<TimeEntry, Guid>().GetAll(expression).AsQueryable();

            if (dataRequest.Filter != null)
                if (dataRequest.Filter.ContainsKey("name") && dataRequest.Filter["name"] != null)
                {
                    var filter = dataRequest.Filter["name"];
                    queryable = queryable.Where(p =>
                        p.Name.Contains(filter) || p.Careplan.PatientRecord.Patient.NDISNumber.Contains(filter));
                }


            var result = queryable.ToDataSourceResult<TimeEntry, TimeEntryViewModel>(_mapper, dataRequest,
                new Sort {Field = "CreatedDate", Direction = SortOrder.DESCENDING});

            return result;
        }

        #endregion


        #region Statements

        public DataSourceResult ListStatements(Guid currentUserId, DataRequestModel dataRequest)
        {
            var patientId = GetPatientId(currentUserId);
            var timeEntry = _genericUnitOfWork.GetRepository<TimeEntry, int>();
            Expression<Func<TimeEntry, bool>> expression = c => c.Careplan.PatientRecord.Patient.Id == patientId;


            var queryable = timeEntry.GetAll(expression).AsQueryable();


            var result = queryable.ToDataSourceResult<TimeEntry, MyStatementListViewModel>(_mapper, dataRequest,
                new Sort {Field = "CreatedDate", Direction = SortOrder.ASCENDING});

            return result;
        }

        public ResponseViewModel<MyStatementDetailsViewModel> GetTimeEntriesDetails(Guid currentUserId,
            Guid timeEntryPublicId)
        {
            var patientId = GetPatientId(currentUserId);
            var timeEntry = _genericUnitOfWork.GetRepository<TimeEntry, int>();
            Expression<Func<TimeEntry, bool>> expression = c => c.Careplan.PatientRecord.Patient.Id == patientId
                                                                && c.PublicId == timeEntryPublicId;

            var timeEntryEntity = timeEntry.FirstOrDefault(expression);
            if (timeEntryEntity == null)
                throw new ArgumentException("Time Entry does not exists");

            var result = _mapper.Map<MyStatementDetailsViewModel>(timeEntryEntity);

            return new ResponseViewModel<MyStatementDetailsViewModel> {Data = result, Success = true};
        }

        #endregion

        #region Invoices

        public ResponseViewModel<InvoiceViewModel> GetInvoice(Guid currentUserId, Guid patiendId)
        {
            var invoice = GenerateInvoice(currentUserId, patiendId);

            return new ResponseViewModel<InvoiceViewModel>
                {Data = _mapper.Map<InvoiceViewModel>(invoice), Success = true};
        }

        public byte[] DownloadInvoice(Guid currentUserId, Guid patiendId)
        {
            var invoice = GenerateInvoice(currentUserId, patiendId);
            var html = _viewRender.Render("PdfTemplate/Invoice", _mapper.Map<InvoiceViewModel>(invoice));

            return PDFBuilder.ConvertHtmltoPdf(_converter, html);
        }

        //TODO:remove: unused
        private Invoice GenerateInvoice(Guid currentUserId, Guid patiendId)
        {
            //TODO: double check if global queries are  filtering per tenant
            var timeEntryBillableItems = _genericUnitOfWork.GetRepository<TimeEntryBillableItem, Guid>().GetAll().Where(
                x =>
                    x.TimeEntry.Careplan.PatientRecord.Patient.PublicId == patiendId
            ).OrderBy(x => x.TimeEntry.StartTime).AsQueryable();

            var patientRecord = GetPatientRecord(currentUserId, patiendId);
            //var invoice = InvoiceBuilder.GetInvoice(patientRecord, timeEntryBillableItems.ToList());

            //return invoice;
            return null;
        }

        #endregion
    }
}