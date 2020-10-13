using System.Collections.Generic;
using CareTaskr.FHIR.Data;
using Hl7.Fhir.Model;
using Hl7.Fhir.Serialization;

namespace CareTaskr.FHIR.Mappers
{
    internal class FWorkflowMapper : FhirMapper
    {
        public FWorkflowMapper(FhirRepository fhirRepository) : base(fhirRepository)
        {
        }

        #region clinical Impression

        public Appointment ToAppointmentResource(Domain.Entities.Appointment appointment)
        {
            var fAppointment = new Appointment
            {
                Status = Appointment.AppointmentStatus.Booked,
                //AppointmentType = new CodeableConcept("", "", appointment.AppointmentType.ToString()),
                Description = appointment.Note,
                Created = ToDateTimeStr(appointment.CreatedDate)
            };

            fAppointment.Start = appointment.StartTime;
            fAppointment.End = appointment.EndTime;

            var patient =
                (Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient, appointment.PatientRecord.PatientId);
            var practitioner =
                (Practitioner) _fhirRepository.SearchByIdentifier(ResourceType.Practitioner,
                    appointment.PractitionerId);


            fAppointment.Participant = new List<Appointment.ParticipantComponent>
            {
                new Appointment.ParticipantComponent
                {
                    Actor = new ResourceReference(patient?.ResourceIdentity().WithoutVersion().ToString()),
                    Required = Appointment.ParticipantRequired.Required,
                    Status = ParticipationStatus.NeedsAction
                },
                new Appointment.ParticipantComponent
                {
                    //TODO: using patient as there is no concept os practitioner yet
                    Actor = new ResourceReference(patient?.ResourceIdentity().WithoutVersion().ToString()),
                    Required = Appointment.ParticipantRequired.Required,
                    Status = ParticipationStatus.NeedsAction
                }
            };


            fAppointment.Identifier.Add(BuildIdentifier(appointment.PublicId));

            var a = new FhirJsonSerializer();
            var c = a.SerializeToString(fAppointment);

            return fAppointment;
        }

        public Domain.Entities.Appointment ToAppointmentEntity(Appointment fAppointment)
        {
            var appointment = new Domain.Entities.Appointment();


            return appointment;
        }

        #endregion
    }
}