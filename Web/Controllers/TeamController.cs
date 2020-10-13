using System;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ParentController
    {
        private readonly IUserManagementService _userManagementService;

        public TeamController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        #region Team

        /// <summary>
        ///     Create a new Team
        /// </summary>
        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.Team.Create)]
        public IActionResult CreateTeam(TeamRequestViewModel model)
        {
            return Ok(_userManagementService.CreateTeam(CurrentUserId(), model));
        }

        /// <summary>
        ///     Update an exsting Team
        /// </summary>
        [Route("{teamId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Team.Update)]
        public IActionResult UpdateTeam(Guid teamId, TeamRequestViewModel model)
        {
            model.Id = teamId;
            return Ok(_userManagementService.UpdateTeam(CurrentUserId(), teamId, model));
        }

        /// <summary>
        ///     Get Team details (including users)
        /// </summary>
        [Route("{teamId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Team.Read)]
        public IActionResult GetTeam(Guid teamId)
        {
            return Ok(_userManagementService.GetTeam(CurrentUserId(), teamId));
        }

        /// <summary>
        ///     Get a List of all Teams (including users)
        /// </summary>
        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Team.Read)]
        public IActionResult GetTeams(DataRequestModel dataRequest)
        {
            return Ok(_userManagementService.ListTeams(CurrentUserId(), dataRequest));
        }


        /// <summary>
        ///     Delete a Team
        /// </summary>
        [Route("{teamId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Team.Delete)]
        public IActionResult DeleteTeam(Guid teamId)
        {
            return Ok(_userManagementService.DeleteTeam(CurrentUserId(), teamId));
        }

        /// <summary>
        ///     Add a single user to a Team
        /// </summary>
        [Route("{teamId}/user")]
        [HttpPost]
        [Authorize(Policy = UserAction.Team.Update)]
        public IActionResult AddTeamUser(Guid teamId, TeamUserRequestViewModel model)
        {
            return Ok(_userManagementService.AddTeamUser(CurrentUserId(), teamId, model));
        }

        /// <summary>
        ///     Remove a single user from a Team
        /// </summary>
        [Route("{teamId}/user/{userId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Team.Update)]
        public IActionResult DeleteTeamUser(Guid teamId, Guid userId)
        {
            return Ok(_userManagementService.DeleteTeamUser(CurrentUserId(), teamId, userId));
        }


        /// <summary>
        ///     List of all Teams (including users)
        /// </summary>
        [Route("list/users")]
        [HttpGet]
        public IActionResult ListTeamUsers()
        {
            return Ok(_userManagementService.ListTeamUsers());
        }

        #endregion
    }
}