using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.FHIR.Data;
using CareTaskr.FHIR.Mappers;
using CareTaskr.Service.Interface;
using Hl7.Fhir.Model;
using Appointment = CareTaskr.Domain.Entities.Appointment;

namespace CareTaskr.Service.Service
{
    public class FWorkflowService : IFWorkflowService
    {
        private readonly FhirRepository _fhirRepository;
        private readonly FWorkflowMapper _mapper;


        public FWorkflowService(IFRepository fhirRepository, IMapper mapper)
        {
            _fhirRepository = (FhirRepository) fhirRepository;
            _mapper = new FWorkflowMapper(_fhirRepository);
        }


        #region Appointment

        public FResult<int, Appointment> CreateAppointment(Appointment appointment)
        {
            var fAppointment = _mapper.ToAppointmentResource(appointment);
            fAppointment = _fhirRepository.Create(fAppointment);

            appointment.FhirResourceId = fAppointment.Id;
            appointment.FhirResourceUri = fAppointment.ResourceIdentity().WithoutVersion().ToString();

            return new FResult<int, Appointment>(true, appointment.Id, appointment);
        }


        public void enrich<TEntity>(TEntity entity) where TEntity : class
        {
            throw new NotImplementedException();
        }

        public FResult<int, Appointment> GetAppointmentLst(List<Guid> appointmentPublicIdLst)
        {
            var result = new FResult<int, Appointment>(true);
            var fResourceLst = _fhirRepository.SearchByIdentifier(ResourceType.Appointment, appointmentPublicIdLst);

            foreach (var fAppointment in fResourceLst)
                result.AddData(int.Parse(((Hl7.Fhir.Model.Appointment) fAppointment).Identifier[0].Value),
                    _mapper.ToAppointmentEntity((Hl7.Fhir.Model.Appointment) fAppointment));
            return result;
        }

        #endregion
    }
}