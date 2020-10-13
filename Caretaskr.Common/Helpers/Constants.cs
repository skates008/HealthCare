namespace Caretaskr.Common.Helpers
{
    public static class Constants
    {
        public static class Strings
        {
            public static class JwtClaimIdentifiers
            {
                public const string Role = "role", Name = "name", LoginInfo = "logininfo";
            }

            public static class Careplan
            {
                public const string DEFAULT_CARE_PLAN_TITLE = "Default Self Funded Plan";
            }
        }

        public class QueryFilters
        {
            public const string TYPE = "type";
            public const string CAREPLAN_ID = "careplanId";
            public const string APPOINTMENT_ID = "appointmentId";
            public const string PATIENT_ID = "patientId";
            public const string PATIENT_RECORD_ID = "patientRecordId";

            public const string INOVOCE_REFERENCE = "invoicereference";
            public const string PATIENT_NDIS_NUMBER = "patientndis";
            public const string PATIENT_NAME = "patientname";
            public const string SERVICE_BOOKING_REFERENCE = "servicebookingreference";
        }
    }
}