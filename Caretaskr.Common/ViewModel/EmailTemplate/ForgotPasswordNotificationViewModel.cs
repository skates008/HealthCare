namespace Caretaskr.Common.ViewModel
{
    public class ForgotPasswordNotificationViewModel: EmailNotificationViewModel
    {
        public string FullName { get; set; }
        public string CallbackUrl { get; set; }
    }

    public class ResetPasswordConfirmationNotificationViewModel: EmailNotificationViewModel
    {
        public string FullName { get; set; }
    }
}