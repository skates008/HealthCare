using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;

namespace CareTaskr.Service.Interface
{
    public interface IUserManagementService
    {
        #region Roles

        Task<ResponseViewModel> CreateRole(Guid currentUserId, RoleRegisterRequestViewModel model);
        ResponseViewModel UpdateRole(Guid currentUserId, UpdateRoleRequestViewModel model);
        DataSourceResult ListRole(DataRequestModel dataRequest);
        ResponseViewModel<RoleResponseViewModel> GetRoleById(Guid id);
        ResponseViewModel<List<ModuleViewModel>> InitRoleCreate();

        #endregion

        #region User

        Task<ResponseViewModel> AddUser(Guid currentUserId, UserRequestViewModel model);
        ResponseViewModel UpdateUser(Guid currentUserId, UserViewModel model);
        ResponseViewModel<UserViewModel> GetUserById(Guid currentUserId, Guid userId);
        ResponseViewModel DeleteUser(Guid currentUserId, Guid userId);

        DataSourceResult ListUsers(Guid currentUserId, DataRequestModel dataRequest);

        #endregion

        #region Teams

        ResponseViewModel CreateTeam(Guid currentUserId, TeamRequestViewModel model);
        ResponseViewModel UpdateTeam(Guid currentUserId, Guid publicId, TeamRequestViewModel model);
        ResponseViewModel AddTeamUser(Guid currentUserId, Guid publicId, TeamUserRequestViewModel model);
        ResponseViewModel DeleteTeamUser(Guid currentUserId, Guid publicTeamId, Guid publicUserId);
        ResponseViewModel GetTeam(Guid currentUserId, Guid teamId);

        ResponseViewModel ListTeamUsers();
        DataSourceResult ListTeams(Guid currentUserId, DataRequestModel dataRequest);
        ResponseViewModel DeleteTeam(Guid currentUserId, Guid teamId);

        #endregion
    }
}