using System;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Reporting;

namespace CareTaskr.Service.Interface
{
    public interface IInvoiceService
    {
        public ResponseViewModel CreateInvoice(Guid currentUserId, InvoiceCreateViewModel model);
        public DataSourceResult GetInvoices(Guid currentUserId, DataRequestModel dataRequest);
        public ResponseViewModel GetInvoice(Guid currentUserId, Guid id);
        public ResponseViewModel TriggerInvoiceEmail(Guid currentUserId, Guid invoiceId);

        public CsvFile<BulkPaymentRequestItem> GetBulkPaymentRequest(Guid currentUserId, string agency,
            DateTime dateFrom, DateTime dateTo);
    }
}