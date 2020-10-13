using System;
using CareTaskr.FHIR.Data;
using Hl7.Fhir.Model;

namespace CareTaskr.FHIR.Mappers
{
    public class FhirMapper
    {
        protected FhirRepository _fhirRepository;

        public FhirMapper(FhirRepository fhirRepository)
        {
            _fhirRepository = fhirRepository;
        }

        public string GetResourceUri(string patientIdentifier)
        {
            return "";
        }

        public string ToDateTimeStr(DateTime dateTime)
        {
            return dateTime != null ? dateTime.ToString("yyyy-MM-ddTHH:mm:sszzz") : null;
        }

        public DateTime FromDateTimeStr(string dateTime)
        {
            return string.IsNullOrEmpty(dateTime) ? DateTime.MinValue : DateTime.Parse(dateTime);
        }

        public string ToDateStr(DateTime dateTime)
        {
            return dateTime != null ? dateTime.ToString("yyyy-MM-dd") : null;
        }

        public DateTime FromDateStr(string dateTime)
        {
            return string.IsNullOrEmpty(dateTime) ? DateTime.MinValue : DateTime.Parse(dateTime);
        }


        public Identifier BuildIdentifier(Guid id)
        {
            return new Identifier {Value = id.ToString()};
        }
    }
}