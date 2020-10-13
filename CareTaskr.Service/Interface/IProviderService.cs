using System;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;

namespace CareTaskr.Service.Interface
{
    public interface IProviderService
    {
        #region Provider

        ResponseViewModel CreateProvider(Guid currentUserId, ProviderRequestViewModel model);
        ResponseViewModel UpdateProvider(Guid currentUserId, Guid publicId, ProviderRequestViewModel model);
        DataSourceResult ListProvider(Guid currentUserId, DataRequestModel dataRequest);
        Task<ResponseViewModel> RegistrationComplete(Guid currentUserId, ProviderRegistrationCompleteViewModel model);
        ResponseViewModel<ProviderUpdateResponseViewModel> GetProviderDetails(Guid userId);
        ResponseViewModel UpdateBusinessProfile(Guid userId, ProviderUpdateRequestViewModel model);

        #endregion


        #region Settings

        #region Appointment Types
        ResponseViewModel CreateAppointmentType(Guid currentUserId, AppointmentTypeViewModel model);
        ResponseViewModel UpdateAppointmentType(Guid currentUserId, Guid publicId, AppointmentTypeViewModel model);
        ResponseViewModel GetAppointmentType(Guid currentUserId, Guid appointmentTypeId);
        DataSourceResult ListAppointmentTypes(Guid currentUserId, DataRequestModel dataRequest);
        ResponseViewModel DeleteAppointmentType(Guid currentUserId, Guid appointmentTypeId);
        #endregion

        #endregion

    }

}