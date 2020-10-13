using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.FHIR.Data;
using CareTaskr.FHIR.Mappers;
using CareTaskr.Service.Interface;
using Hl7.Fhir.Model;
using Observation = CareTaskr.Domain.Entities.Observation;

namespace CareTaskr.Service.Service
{
    public class FDiagnosticsService : IFDiagnosticsService
    {
        private readonly FhirRepository _fhirRepository;
        private readonly FDiagnosticsMapper _mapper;


        public FDiagnosticsService(IFRepository fhirRepository, IMapper mapper)
        {
            _fhirRepository = (FhirRepository) fhirRepository;
            _mapper = new FDiagnosticsMapper(_fhirRepository);
        }

        #region Observations

        public FResult<Guid, Observation> CreateObservation(Observation observation)
        {
            var fObservation = _mapper.ToObservationResource(observation);
            fObservation = _fhirRepository.Create(fObservation);

            observation.FhirResourceId = fObservation.Id;
            observation.FhirResourceUri = fObservation.ResourceIdentity().WithoutVersion().ToString();

            return new FResult<Guid, Observation>(true, observation.Id, observation);
        }

        public void enrich<TEntity>(TEntity entity) where TEntity : class
        {
            throw new NotImplementedException();
        }

        FResult<Guid, Observation> IFDiagnosticsService.GetObservationLst(List<Guid> observationIdLst)
        {
            var result = new FResult<Guid, Observation>(true);
            var fResourceLst = _fhirRepository.SearchByIdentifier(ResourceType.Observation, observationIdLst);

            foreach (var fObservation in fResourceLst)
                result.AddData(new Guid(((Hl7.Fhir.Model.Observation) fObservation).Identifier[0].Value),
                    _mapper.ToObservationEntity((Hl7.Fhir.Model.Observation) fObservation));
            return result;
        }

        #endregion
    }
}