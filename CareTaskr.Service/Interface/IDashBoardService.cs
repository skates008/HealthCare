using System;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;

namespace CareTaskr.Service.Interface
{
    public interface IDashBoardService
    {
        Task<ResponseViewModel<InitRegistrationtViewModel>> InitRegistration(Guid currentUserId);

        Task<ResponseViewModel> RegistrationComplete(Guid currentUserId, InitRegistrationtViewModel model);
    }
}