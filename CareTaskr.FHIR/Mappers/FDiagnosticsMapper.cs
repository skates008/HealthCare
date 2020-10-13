using System.Collections.Generic;
using CareTaskr.FHIR.Data;
using Hl7.Fhir.Model;

namespace CareTaskr.FHIR.Mappers
{
    internal class FDiagnosticsMapper : FhirMapper
    {
        public FDiagnosticsMapper(FhirRepository fhirRepository) : base(fhirRepository)
        {
        }

        #region clinical Impression

        public Observation ToObservationResource(Domain.Entities.Observation observation)
        {
            var fObservation = new Observation
            {
                Status = ObservationStatus.Final,
                Code = new CodeableConcept("", "", "")
            };
            var subject =
                (Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient,
                    observation.PatientRecord.Patient.Id);
            var performer =
                (Practitioner) _fhirRepository.SearchByIdentifier(ResourceType.Practitioner, observation.PraticionerId);
            ResourceReference author = null;

            if (subject != null)
                fObservation.Subject = new ResourceReference(subject.ResourceIdentity().WithoutVersion().ToString());


            fObservation.Note = new List<Annotation>
            {
                new Annotation
                {
                    //TODO:Author = author,
                    Time = ToDateTimeStr(observation.Date),
                    Text = new Markdown(observation.Text)
                }
            };

            fObservation.Identifier.Add(BuildIdentifier(observation.Id));

            //FhirJsonSerializer a = new FhirJsonSerializer();
            //var c = a.SerializeToString(fObservation);

            return fObservation;
        }

        public Domain.Entities.Observation ToObservationEntity(Observation fObservation)
        {
            var observation = new Domain.Entities.Observation();

            if (fObservation.Note.Count == 1)
            {
                var note = fObservation.Note[0];
                observation.Text = note.Text.ToString();
                observation.Date = FromDateStr(note.Time);
            }


            return observation;
        }

        #endregion
    }
}