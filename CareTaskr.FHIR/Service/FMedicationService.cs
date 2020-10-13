using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.FHIR.Data;
using CareTaskr.FHIR.Mappers;
using CareTaskr.Service.Interface;
using Hl7.Fhir.Model;
using Medication = CareTaskr.Domain.Entities.Medication;

namespace CareTaskr.Service.Service
{
    public class FMedicationService : IFMedicationService
    {
        private readonly FhirRepository _fhirRepository;
        private readonly FMedicationMapper _mapper;


        public FMedicationService(IFRepository fhirRepository, IMapper mapper)
        {
            _fhirRepository = (FhirRepository) fhirRepository;
            _mapper = new FMedicationMapper(_fhirRepository);
        }


        #region Medication

        public FResult<Guid, Medication> CreateMedication(Medication medication)
        {
            var fMedication = _mapper.ToMedicationResource(medication);
            fMedication = _fhirRepository.Create(fMedication);

            medication.FhirResourceId = fMedication.Id;
            medication.FhirResourceUri = fMedication.ResourceIdentity().WithoutVersion().ToString();

            return new FResult<Guid, Medication>(true, medication.Id, medication);
        }

        public FResult<Guid, Medication> DeleteMedication(Guid medicationId)
        {
            var fMedication =
                (Hl7.Fhir.Model.Medication) _fhirRepository.SearchByIdentifier(ResourceType.Medication, medicationId);
            fMedication.Status = Hl7.Fhir.Model.Medication.MedicationStatusCodes.Inactive;
            fMedication = _fhirRepository.Update(fMedication);
            return new FResult<Guid, Medication>(true);
        }

        public void enrich<TEntity>(TEntity entity) where TEntity : class
        {
            throw new NotImplementedException();
        }

        public FResult<Guid, Medication> GetMedicationLst(List<Guid> medicationIdLst)
        {
            var result = new FResult<Guid, Medication>(true);
            var fResourceLst = _fhirRepository.SearchByIdentifier(ResourceType.Medication, medicationIdLst);

            foreach (var fMedication in fResourceLst)
                result.AddData(new Guid(((Hl7.Fhir.Model.Medication) fMedication).Identifier[0].Value),
                    _mapper.ToMedicationEntity((Hl7.Fhir.Model.Medication) fMedication));
            return result;
        }

        #endregion
    }
}