using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashBoardController : ParentController
    {
        private readonly IDashBoardService _dashBoardService;

        public DashBoardController(IDashBoardService dashBoardService)
        {
            _dashBoardService = dashBoardService;
        }

        // to remove this api after fe integration actual api on patientcontroller and usermanagement

        #region DashBoard

        [Route("initRegistration")]
        [HttpGet]
        public async Task<IActionResult> InitRegistration()
        {
            return Ok(await _dashBoardService.InitRegistration(CurrentUserId()));
        }

        [Route("registrationComplete")]
        [HttpPost]
        public async Task<IActionResult> RegistrationComplete(InitRegistrationtViewModel model)
        {
            return Ok(await _dashBoardService.RegistrationComplete(CurrentUserId(), model));
        }

        #endregion
    }
}