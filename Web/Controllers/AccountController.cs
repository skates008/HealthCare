using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ParentController
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> RegisterUser(UserRegisterRequestViewModel model)
        {
            return Ok(await _accountService.RegisterUser(model));
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login(SignInViewModel model)
        {
            return Ok(await _accountService.Login(model));
        }

        [Route("forgotpassword")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            return Ok(await _accountService.ForgotPassword(model));
        }

        [Route("resetpassword")]
        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            return Ok(await _accountService.ResetPassword(model));
        }

        [Route("confirmemail")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(EmailConfirmationViewModel model)
        {
            return Ok(await _accountService.ConfirmEmail(model));
        }

        #region Welcome Page

        [Route("initRegistration")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> InitRegistration()
        {
            return Ok(await _accountService.InitRegistration(CurrentUserId()));
        }

        [Route("registrationComplete")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RegistrationComplete(InitRegistrationtViewModel model)
        {
            return Ok(await _accountService.RegistrationComplete(CurrentUserId(), model));
        }

        [Route("isRegistrationComplete")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> IsRegistrationComplete()
        {
            return Ok(await _accountService.IsRegistrationComplete(CurrentUserId()));
        }

        #endregion

        [HttpPost]
        [Authorize]
        [Route("refreshtoken")]
        public async Task<IActionResult> RefreshToken(RefreshTokenViewModel model)
        {
            return Ok(await _accountService.RefreshToken(CurrentUserId(), model));
        }

        [HttpPost]
        [Authorize]
        [Route("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            return Ok(await _accountService.ChangePassword(CurrentUserId(), model));
        }


        [Route("resendemailconfirmation")]
        [HttpPost]
        public async Task<IActionResult> ResendEmailConfirmation(ResendEmailConfirmationViewModel model)
        {
            return Ok(await _accountService.ResendEmailConfirmation(CurrentUserId(), model));
        }

        //for manual email confirmation
        [Route("emailconfirm")]
        [HttpPost]
        public async Task<IActionResult> ForceEmailConfirm(RegisterResponseViewModel model)
        {
            return Ok(await _accountService.ForceEmailConfirm(CurrentUserId(), model));
        }

    }
}