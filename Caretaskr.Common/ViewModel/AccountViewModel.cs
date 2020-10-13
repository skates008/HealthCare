using System;
using System.Collections.Generic;
using Caretaskr.Common.Dto;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class UserRegisterRequestViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public UserType UserType { get; set; }
    }

    public class SignInViewModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class RegisterResponseViewModel
    {
        public Guid UserId { get; set; }
    }

    public class SignInResponseViewModel
    {
        public SignInResponseViewModel()
        {
            UserPages = new List<UserPageViewModel>();
        }

        public string UserName { get; set; }
        public string AccessToken { get; set; }
        public int ExpiresIn { get; set; }
        public LoginInfo LoginInfo { get; set; }
        public List<UserPageViewModel> UserPages { get; set; }
        public string RefreshToken { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        public string Email { get; set; }
    }


    public class ResetPasswordViewModel
    {
        public Guid UserId { get; set; }
        public string Code { get; set; }
        public string Password { get; set; }
    }

    public class EmailConfirmationViewModel
    {
        public string Code { get; set; }
    }

    public class RefreshTokenViewModel
    {
        public string Token { get; set; }
    }

    public class TokenResponseViewModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public DateTime TokenExpiration { get; set; }
    }

    public class ChangePasswordViewModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class ResendEmailConfirmationViewModel
    {
        public Guid UserId { get; set; }
    }
}