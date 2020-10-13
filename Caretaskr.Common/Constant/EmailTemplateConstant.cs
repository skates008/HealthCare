namespace Caretaskr.Common.Constant
{
    public class EmailTemplate
    {
        public const string BASE_EMAIL = "EmailTemplate/";

        public const string EMAIL_CONFIRMATION = BASE_EMAIL + "EmailConfirmation";
        public const string EMAIL_CONFIRMATION_SUCCESS = BASE_EMAIL + "EmailConfirmationSuccess";

        public const string USER_REGISTRATION = BASE_EMAIL + "UserRegistration";
        public const string PATIENT_REGISTRATION = BASE_EMAIL + "PatientRegistration";

        public const string FORGOT_PASSWORD = BASE_EMAIL + "ForgotPassword";
        public const string RESET_PASSWORD_CONFIRMATION_SUCCESS = BASE_EMAIL + "ResetPasswordConfirmation";
        public const string INVOICE_NEW = BASE_EMAIL + "Invoice";

        public const string APPOINTMENT_NOTIFICATION_PRACTITIONER = BASE_EMAIL + "NewAppointmentPractitioner";
        public const string APPOINTMENT_NOTIFICATION_PARTICIPANT = BASE_EMAIL + "NewAppointmentParticipant";


        public const string APPOINTMENT_UPDATE_NOTIFICATION_PRACTITIONER = BASE_EMAIL + "UpdateAppointmentPractitioner";
        public const string APPOINTMENT_UPDATE_NOTIFICATION_PARTICIPANT = BASE_EMAIL + "UpdateAppointmentParticipant";
    }

    public class SENDGRIDEMAILTEMPLATE
    {
        public const string EMAIL_VERIFICATION = "d-0b8d616af90f49d787eef331283010e8";
        public const string EMAIL_CONFIRMATION_SUCCESS = "d-e96ca09b9aed4fc7ba67cea36dfb0567";

        public const string FORGOT_PASSWORD = "d-6a53f426ab3b496e83087c24d423fa49";

        public const string APPOINTMENT_NOTIFICATION_PRACTITIONER = "d-0ecdf35b8516480fae1178bdb7b92564";
        public const string APPOINTMENT_UPDATE_NOTIFICATION_PRACTITIONER = "d-a5cefc3a0ab744a89d2f4cbd041b7a7f";

        public const string APPOINTMENT_NOTIFICATION_PARTICIPANT = "d-74f0e7e43ae04449a6158e0c9e855432";
        public const string APPOINTMENT_UPDATE_NOTIFICATION_PARTICIPANT = "d-f284d136a754414994ae766864a1a7c2";

        public const string VIEW_INVOICE = "d-09b42f30c82f402a8a77cf3e5fc811ff";



    }
}