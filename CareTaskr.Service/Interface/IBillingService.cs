using System;
using System.Collections.Generic;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Service.Reporting;

namespace CareTaskr.Service.Interface
{
    public interface IBillingService
    {
        #region Reporting

        ICollection<TimeEntryReport> GetTimeEntryReport(Guid currentUserId, Guid providerId, DateTime dateTimeFrom,
            DateTime dateTimeTo);

        #endregion

        public Careplan EnrichWithFunds(Careplan careplan);
        public decimal GetRemainingFunds(Careplan careplan);
        public decimal GetRemainingFunds(PatientRecord patientRecord);

        #region BillableItem

        ResponseViewModel CreateBillableItem(Guid currentUserId, BillableItemRequestViewModel model);
        ResponseViewModel UpdateBillableItem(Guid currentUserId, Guid publicId, BillableItemRequestViewModel model);
        DataSourceResult ListBillableItem(Guid currentUserId, DataRequestModel dataRequest);
        ResponseViewModel GetBillableItem(Guid guid, Guid billableItemId);
        ResponseViewModel DeleteBillableItem(Guid currentUserId, Guid publicId);

        #endregion


        #region Time Entry

        ResponseViewModel CreateTimeEntry(Guid currentUserId, TimeEntryRequestViewModel model);

        ResponseViewModel UpdateTimeEntry(Guid currentUserId, Guid appointmentId, Guid timeEntryPublicId,
            TimeEntryRequestViewModel model);

        DataSourceResult GetAppointmentTimeEntries(Guid currentUserId, Guid appointmentId,
            DataRequestModel dataRequest);

        DataSourceResult GetCareplanTimeEntries(Guid currentUserId, Guid careplanId, DataRequestModel dataRequest);
        ResponseViewModel GetTimeEntry(Guid currentUserId, Guid timeEntryPublicId);
        DataSourceResult GetTimeEntries(Guid currentUserId, DataRequestModel dataRequest);

        ResponseViewModel DeleteTimeEntry(Guid currentUserId, Guid publicId);

        ResponseViewModel DeleteTimeEntryBillableItem(Guid currentUserId, Guid timeEntryId, Guid billableItemId);

        #endregion


        #region My Statements

        DataSourceResult ListStatements(Guid currentUserId, DataRequestModel dataRequest);

        ResponseViewModel<MyStatementDetailsViewModel>
            GetTimeEntriesDetails(Guid currentUserId, Guid timeEntryPublicId);

        ResponseViewModel<InvoiceViewModel> GetInvoice(Guid guid, Guid patiendId);

        byte[] DownloadInvoice(Guid currentUserId, Guid patiendId);

        #endregion
    }
}