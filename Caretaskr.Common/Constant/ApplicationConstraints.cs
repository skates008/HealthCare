namespace Caretaskr.Common.Constant
{
    public class ErrorMessage
    {
        public const string EMAIL_ALREADY_EXISTS = "Email Already Exists!";
        public const string PHONE_ALREADY_EXISTS = "Phone Number Already Exists!";
        public const string EMAIL_INVALID = "Email Address must be Valid!";
        public const string CARER_EMAIL_INVALID = "Carer Email Address must be Valid!";
        public const string SCHOOL_EMAIL_INVALID = "School Email Address must be Valid!";
        public const string SCHOOL_TEACHER_EMAIL_INVALID = "School Teacher Email Address must be Valid!";
        public const string PASSWORD_EMPTY = "Password is required";

        public const string PASSWORD_INVALID_CREATE =
            "Password must be at least 8 characters long, contain a number, one uppercase, one lower and one special characters";

        public const string PASSWORD_CONFIRM = "Password and Confirm password does not match";
        public const string NDIS_ALREADY_EXISTS = "NDIS Already Exists!";
        public const string USER_DOES_NOT_EXIST = "User does not Exist";

        public const string OLD_AND_NEW_PASSWORD_CANNOT_BE_SAME = "Old password and new password can not be same!";
        public const string CONFIRM_PASSWORD_INCORRECT = "Your Current password is incorrect";
        public const string DATE_OF_BIRTH_LESS_THAN = "Date Of Birth must be less than today's Date";

        public const string PARTICIPANT_APPOINTMENT_EXISTS = "Participant Has another appointment!";

        public const string PRACTITIONER_APPOINTMENT_EXISTS = "Practitioner Has another appointment!";
        public const string APPOINTMENT_RECCURRENCE_LIMIT = "Cannot schedule more than 100 appointments at a time.!";
    }
}