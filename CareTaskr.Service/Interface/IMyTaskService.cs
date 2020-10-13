using System;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;

namespace CareTaskr.Service.Interface
{
    public interface IMyTaskService
    {
        #region MyTaskService

        ResponseViewModel CreateMyTask(Guid currentUserId, CreateMyTaskViewModel model);
        ResponseViewModel<MyTaskResponseViewModel> GetMyTaskServiceById(Guid currentUserId, Guid id);
        DataSourceResult ListMyTask(Guid currentUserId, DataRequestModel dataRequest);
        ResponseViewModel UpdateMyTask(Guid currentUserId, UpdateMyTaskViewModel model);
        ResponseViewModel DeleteTask(Guid currentUserId, Guid id);

        #endregion
    }
}