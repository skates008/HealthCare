using System;
using System.Threading.Tasks;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserManagementController : ParentController
    {
        private readonly IUserManagementService _userManagementService;

        public UserManagementController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        #region Role

        [Route("list")]
        [HttpPost]
        public IActionResult ListRole(DataRequestModel model)
        {
            return Ok(_userManagementService.ListRole(model));
        }


        [Route("role")]
        [HttpPost]
        public async Task<IActionResult> CreateRole(RoleRegisterRequestViewModel model)
        {
            return Ok(await _userManagementService.CreateRole(CurrentUserId(), model));
        }


        [Route("role/{roleId}")]
        [HttpPut]
        public IActionResult UpdateRole(UpdateRoleRequestViewModel model, Guid roleId)
        {
            model.Id = roleId;
            return Ok(_userManagementService.UpdateRole(CurrentUserId(), model));
        }


        [Route("role/{roleId}")]
        [HttpGet]
        public IActionResult GetRoleById(Guid roleId)
        {
            return Ok(_userManagementService.GetRoleById(roleId));
        }

        [Route("init")]
        [HttpGet]
        public IActionResult InitRoleCreate()
        {
            return Ok(_userManagementService.InitRoleCreate());
        }

        #endregion

        #region User Management

        [Route("user/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.User.Read)]
        public IActionResult ListUsers(DataRequestModel model)
        {
            return Ok(_userManagementService.ListUsers(CurrentUserId(), model));
        }


        [Route("user")]
        [HttpPost]
        [Authorize(Policy = UserAction.User.Create)]
        public async Task<IActionResult> AddUser(UserRequestViewModel model)
        {
            return Ok(await _userManagementService.AddUser(CurrentUserId(), model));
        }


        [Route("user/{userId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.User.Update)]
        public IActionResult UpdateUser(UserViewModel model, Guid userId)
        {
            model.Id = userId;
            return Ok(_userManagementService.UpdateUser(CurrentUserId(), model));
        }


        [Route("user/{userId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.User.Read)]
        public IActionResult GetUserById(Guid userId)
        {
            return Ok(_userManagementService.GetUserById(CurrentUserId(), userId));
        }


        [Route("user/{userId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.User.Delete)]
        public IActionResult DeleteUser(Guid userId)
        {
            return Ok(_userManagementService.DeleteUser(CurrentUserId(), userId));
        }

        #endregion
    }
}