namespace Caretaskr.Common.ViewModel
{
    public class EmailConfirmationNotificationViewModel: EmailNotificationViewModel
    {
        public string FullName { get; set; }
        public string CallBackUrl { get; set; }

        public string ResetPasswordUrl { get; set; }
    }
}