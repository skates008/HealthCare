using Caretaskr.Common.Constant;

namespace Caretaskr.Common.ViewModel
{


    public class EmailNotificationViewModel
    {
        public string LogoUrl { get; set; } 
        public string EmailIconUrl { get; set; } 
        public string WebUrl { get; set; }
          
    }
    public class PatientRegistrationViewModel: EmailNotificationViewModel
    {
        public string FullName { get; set; }
        public string Password { get; set; }
        public string CallBackUrl { get; set; }
    }

    public class NewUserRegistrationViewModel: EmailNotificationViewModel
    {
        public string FullName { get; set; }
        public string CallBackUrl { get; set; }
    }

    

}