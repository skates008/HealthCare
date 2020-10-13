using System;
using System.Collections.Generic;
using System.Linq;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using CareTaskr.FHIR.Data;
using Hl7.Fhir.Model;
using static Hl7.Fhir.Model.AllergyIntolerance;
using static Hl7.Fhir.Model.ClinicalImpression;
using ClinicalImpression = Hl7.Fhir.Model.ClinicalImpression;
using Patient = Hl7.Fhir.Model.Patient;

namespace CareTaskr.FHIR.Mappers
{
    internal class FClinicalImpressionMapper : FhirMapper
    {
        public FClinicalImpressionMapper(FhirRepository fhirRepository) : base(fhirRepository)
        {
        }

        #region clinical Impression

        public ClinicalImpression ToClinicalImpressionResource(Domain.Entities.ClinicalImpression clinicalImpression)
        {
            var impression = new ClinicalImpression
            {
                Status = clinicalImpression.IsActive
                    ? ClinicalImpressionStatus.Completed
                    : ClinicalImpressionStatus.EnteredInError,
                Date = ToDateTimeStr(clinicalImpression.Date),
                Summary = clinicalImpression.Summary,
                Description = clinicalImpression.Description
            };

            var subject =
                (Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient,
                    clinicalImpression.PatientRecord.PatientId);
            var assessor =
                (Practitioner) _fhirRepository.SearchByIdentifier(ResourceType.Practitioner,
                    clinicalImpression.PraticionerId);

            if (subject != null)
                impression.Subject = new ResourceReference(subject.ResourceIdentity().WithoutVersion().ToString());
            if (assessor != null)
                impression.Assessor = new ResourceReference(assessor.ResourceIdentity().WithoutVersion().ToString());
            impression.Identifier.Add(BuildIdentifier(clinicalImpression.Id));
            return impression;
        }

        public Domain.Entities.ClinicalImpression ToClinicalImpressionEntity(ClinicalImpression clinicalImpression,
            string patientId = null)
        {
            var impression = new Domain.Entities.ClinicalImpression();

            //No need as we are keeping these on DB
            //if(patientId == null)
            //{
            //    var patient = (Hl7.Fhir.Model.Patient)_fhirRepository.Get(clinicalImpression.Subject.Url);
            //    patientId = patient.Identifier[0].Value;
            //}
            //impression.PatientId = new Guid(patientId);


            //if (clinicalImpression.Assessor != null)
            //{
            //    var assessor = (Hl7.Fhir.Model.Practitioner)_fhirRepository.Get(clinicalImpression.Assessor.Url);
            //    impression.PraticionerId = assessor != null ? new Guid(clinicalImpression.Assessor.Identifier.Value) : Guid.Empty;
            //}
            //impression.Id = clinicalImpression.Identifier.Count > 0 ? new Guid(clinicalImpression.Identifier[0].Value) : Guid.Empty;
            impression.Description = clinicalImpression.Description;
            impression.Summary = clinicalImpression.Summary;
            impression.Date = FromDateTimeStr(clinicalImpression.Date);


            return impression;
        }

        #endregion

        #region Allergy Intolerance

        //Allery Intolerance http://hl7.org/fhir/allergyintolerance.html
        //TODO:
        // - Clinical Status
        // - Verification Status
        // - Type
        // - Code
        // - Severity
        public AllergyIntolerance ToAllergyIntoleranceResource(Allergies allergy)
        {
            var allergyIntolerance = new AllergyIntolerance
            {
                ClinicalStatus =
                    new CodeableConcept("http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", "active",
                        "active"),
                VerificationStatus =
                    new CodeableConcept("http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
                        "confirmed", "confirmed")
            };

            allergyIntolerance.Identifier.Add(BuildIdentifier(allergy.Id));

            //var category = new List<AllergyIntoleranceCategory>() { (AllergyIntoleranceCategory)Enum.Parse(typeof(AllergyIntoleranceCategory), allergy.Category.ToString(), true) };
            //allergyIntolerance.Category = new ArrayList() { category };
            allergyIntolerance.Criticality =
                (AllergyIntoleranceCriticality) Enum.Parse(typeof(AllergyIntoleranceCriticality),
                    allergy.Critical.ToString(), true);
            allergyIntolerance.LastOccurrence = ToDateTimeStr(allergy.LastOccurenceDate);
            allergyIntolerance.RecordedDate = ToDateTimeStr(allergy.CreatedDate);

            allergyIntolerance.Reaction = new List<ReactionComponent>();
            allergyIntolerance.Reaction.Add(new ReactionComponent
            {
                Substance = new CodeableConcept("", "", allergy.Allergen),
                Manifestation = new List<CodeableConcept> {new CodeableConcept("", "", "")}
            });


            var patient = (Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient, allergy.PatientId);
            if (patient != null)
                allergyIntolerance.Patient =
                    new ResourceReference(patient.ResourceIdentity().WithoutVersion().ToString());

            allergyIntolerance.Type =
                AllergyIntoleranceType
                    .Allergy; //(AllergyIntoleranceType)Enum.Parse(typeof(AllergyIntoleranceType), allergy.Type, true);


            return allergyIntolerance;
        }

        public Allergies ToAllergyIntoleranceEntity(AllergyIntolerance allergyIntolerance)
        {
            var allergy = new Allergies();
            try
            {
                allergy.ClinicalStatus = (ClinicalStatus) Enum.Parse(typeof(ClinicalStatus),
                    allergyIntolerance.ClinicalStatus.Text, true);
                allergy.Id = allergyIntolerance.Identifier.Count > 0
                    ? new Guid(allergyIntolerance.Identifier[0].Value)
                    : Guid.Empty;

                allergy.Critical =
                    (Critical) Enum.Parse(typeof(Critical), allergyIntolerance.Criticality.ToString(), true);
                allergy.LastOccurenceDate = FromDateTimeStr(allergyIntolerance.LastOccurrence);
                //allergy.createdAt = FromDateStr(allergyIntolerance.RecordedDate);
                allergy.Allergen = allergyIntolerance.Reaction.First().Substance.Text;

                //var patient = (Hl7.Fhir.Model.Patient)_fhirRepository.Get(allergyIntolerance.Patient.Url);
                //allergy.PatientId = new Guid(patient.Identifier[0].Value);
            }
            catch
            {
                //TODO: log errors
            }

            return allergy;
        }

        #endregion
    }
}