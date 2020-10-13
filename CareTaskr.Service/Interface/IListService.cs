using System;
using System.Collections.Generic;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;

namespace CareTaskr.Service.Interface
{
    public interface IListService
    {
        IList<ListViewModel> ListGender();
        IList<ListViewModel> ListEthinicity();
        IList<AppointmentTypeViewModel> ListTypeOfAppointments();
        IList<ListViewModel> ListCountries();
        IList<ListViewModel> ListParticipant(Guid loggedInUserId);
        IList<ListViewModel> ListPractioner(Guid loggedInUserId);
        IList<ListViewModel> ListPractionerByTeam(Guid curentUserId, Guid teamId);

        IList<ListViewModel> ListBudgetByPatientId(Guid patientId);

        IList<ListViewModel> ListFundCategory();

        IList<ListBillableItemViewModel> ListBillableItems(Guid curentUserId);

        IList<ListCarePlanViewModel> ListCareplanByPatient(Guid patientId);

        IList<ListViewModel> ListUserType(Guid currentUserId);
        IList<ListViewModel> ListBillingType(Guid currentUserId);

        IList<ListAddressViewModel> ListAddressTypes(Guid patientId);
    }
}