using System;
using Caretaskr.Common.ViewModel;

namespace CareTaskr.Service.Interface
{
    public interface IMyProfileService
    {
        ResponseViewModel UpdateBasicDetails(Guid currentUserId, MyProfileBasicDetailsViewModel model);
        ResponseViewModel<MyProfileDetailsViewModel> GetUserDetails(Guid currentUserId);
    }
}