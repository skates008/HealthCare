using Caretaskr.Common.ViewModel;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MyProfileController : ParentController
    {
        private readonly IMyProfileService _myProfileService;

        public MyProfileController(IMyProfileService myProfileService)
        {
            _myProfileService = myProfileService;
        }

        #region Update User Details

        [Route("")]
        [HttpPost]
        public IActionResult MyProfileUpdate(MyProfileBasicDetailsViewModel model)
        {
            return Ok(_myProfileService.UpdateBasicDetails(CurrentUserId(), model));
        }


        [Route("")]
        [HttpGet]
        public IActionResult GetUserDetails()
        {
            return Ok(_myProfileService.GetUserDetails(CurrentUserId()));
        }

        #endregion
    }
}