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
    public class MyTaskController : ParentController
    {
        private readonly IMyTaskService _myTaskService;

        public MyTaskController(IMyTaskService myTaskService)
        {
            _myTaskService = myTaskService;
        }

        #region My Task

        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.MyTask.Create)]
        public IActionResult CreateTask(CreateMyTaskViewModel model)
        {
            return Ok(_myTaskService.CreateMyTask(CurrentUserId(), model));
        }

        [Route("{taskId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.MyTask.Update)]
        public IActionResult UpdateCareplan(Guid taskId, UpdateMyTaskViewModel model)
        {
            model.Id = taskId;
            return Ok(_myTaskService.UpdateMyTask(CurrentUserId(), model));
        }


        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.MyTask.Read)]
        public IActionResult ListTask(DataRequestModel dataRequest)
        {
            return Ok(_myTaskService.ListMyTask(CurrentUserId(), dataRequest));
        }


        [Route("{taskId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.MyTask.Read)]
        public IActionResult GetTaskById(Guid TaskId)
        {
            return Ok(_myTaskService.GetMyTaskServiceById(CurrentUserId(), TaskId));
        }


        [Route("{taskId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.MyTask.Delete)]
        public IActionResult DeleteTask(Guid taskId)
        {
            return Ok(_myTaskService.DeleteTask(CurrentUserId(), taskId));
        }

        #endregion
    }
}