using System;
using System.Collections.Generic;
using CareTaskr.Domain.Enum;
using CareTaskr.FHIR.Data;
using Hl7.Fhir.Model;

namespace CareTaskr.FHIR.Mappers
{
    public class FPatientMapper : FhirMapper
    {
        private static readonly string EXTENSION_URI_NDIS_NUMBER = "NDIS_NUMBER";
        private static readonly string EXTENSION_URI_ETHNICITY = "ETHNICITY";

        public FPatientMapper(FhirRepository fhirRepository) : base(fhirRepository)
        {
        }

        public Patient ToPatientResource(Domain.Entities.Patient patient)
        {
            var resource = (Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient, patient.Id);

            if (resource == null) resource = new Patient();

            //https://www.hl7.org/fhir/patient.html

            resource.Identifier = new List<Identifier>
            {
                new Identifier
                {
                    Value = patient.Id.ToString()
                }
            };
            resource.Name = new List<HumanName>
            {
                new HumanName
                {
                    Text = patient.PreferredName,
                    Given = new List<string> {patient.FirstName},
                    Family = patient.LastName
                }
            };

            resource.Address = new List<Address>
            {
                new Address
                {
                    Country = patient.Country
                }
            };

            resource.BirthDate = ToDateStr(patient.DateOfBirth.Value);
            resource.Gender =
                (AdministrativeGender) Enum.Parse(typeof(AdministrativeGender), patient.Gender.ToString(), true);
            resource.AddExtension(EXTENSION_URI_NDIS_NUMBER, new FhirString(patient.NDISNumber));
            resource.AddExtension(EXTENSION_URI_ETHNICITY, new FhirString(patient.Ethnicity.ToString()));
            //Ethnicity
            //NDISNumber

            return resource;
        }

        public Domain.Entities.Patient ToPatientEntity(Patient fPatient)
        {
            var patient = new Domain.Entities.Patient();
            EnrichEntity(patient, fPatient);
            return patient;
        }

        public void EnrichEntity(in Domain.Entities.Patient patient, Patient fPatient)
        {
            if (fPatient == null) return;
            try
            {
                patient.FhirResourceId = fPatient.Id;
                patient.FhirResourceUri = fPatient.ResourceIdentity().WithoutVersion().ToString();
                patient.DateOfBirth = FromDateStr(fPatient.BirthDate);
                patient.FirstName = fPatient.Name[0].GivenElement[0].ToString();
                patient.LastName = fPatient.Name[0].Family;
                patient.PreferredName = fPatient.Name[0].Text;
                patient.Gender = (Gender) Enum.Parse(typeof(Gender), fPatient.Gender.ToString(), true);
                patient.Country = fPatient.Address.Count > 0 ? fPatient.Address[0].Country : null;

                if (fPatient.Extension.Count > 0)
                {
                    var ethnicity = fPatient.Extension.FindLast(c => c.Url == EXTENSION_URI_ETHNICITY).Value.ToString();
                    patient.Ethnicity = (Ethnicity) Enum.Parse(typeof(Ethnicity), ethnicity);
                    // (Ethnicity)Enum.Parse(typeof(Ethnicity), fPatient.GetExtensionValue<FhirString>(EXTENSION_URI_ETHNICITY).ToString(), true);
                }
            }
            catch
            {
            }
        }
    }
}