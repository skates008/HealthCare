using System;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;

namespace CareTaskr.Service.Interface
{
    public interface IAccountService
    {
        Task<ResponseViewModel> RegisterUser(UserRegisterRequestViewModel model);
        Task<ResponseViewModel> Login(SignInViewModel model);

        Task<ResponseViewModel> ForgotPassword(ForgotPasswordViewModel model);

        Task<ResponseViewModel> ResetPassword(ResetPasswordViewModel model);
        Task<ResponseViewModel> ConfirmEmail(EmailConfirmationViewModel model);

        Task<ResponseViewModel<InitRegistrationtViewModel>> InitRegistration(Guid currentUserId);

        Task<ResponseViewModel> RegistrationComplete(Guid currentUserId, InitRegistrationtViewModel model);

        Task<ResponseViewModel> IsRegistrationComplete(Guid currentUserId);
        Task<ResponseViewModel> RefreshToken(Guid currentUserId, RefreshTokenViewModel model);

        Task<ResponseViewModel> ChangePassword(Guid currentUserId, ChangePasswordViewModel model);

        Task SendEmailConfirmationLink(Guid userId, string email);

        Task<ResponseViewModel> ResendEmailConfirmation(Guid currentUserId, ResendEmailConfirmationViewModel model);

        Task<ResponseViewModel> ForceEmailConfirm(Guid currentUserId, RegisterResponseViewModel model);
    }
}