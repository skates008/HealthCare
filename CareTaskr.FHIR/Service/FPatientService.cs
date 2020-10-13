using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.FHIR.Data;
using CareTaskr.FHIR.Mappers;
using CareTaskr.Service.Interface;
using Hl7.Fhir.Model;
using Patient = CareTaskr.Domain.Entities.Patient;

namespace CareTaskr.Service.Service
{
    public class FPatientService : IFPatientService
    {
        private readonly FhirRepository _fhirRepository;
        private readonly FPatientMapper _mapper;
        private IFClinicalInfoService _fhirClinicalInfoService;

        public FPatientService(IFRepository fhirRepository, IFClinicalInfoService fhirClinicalInfoService,
            IMapper mapper)
        {
            _fhirRepository = (FhirRepository) fhirRepository;
            _mapper = new FPatientMapper(_fhirRepository);

            _fhirClinicalInfoService = fhirClinicalInfoService;
        }


        public FResult<Guid, Patient> CreatePatient(Patient patient)
        {
            var fhirPatient = _mapper.ToPatientResource(patient);
            var createdFhirPatient = CreateFhirPatient(fhirPatient);

            patient.FhirResourceId = createdFhirPatient.Id;
            patient.FhirResourceUri = createdFhirPatient.ResourceIdentity().WithoutVersion().ToString();

            return new FResult<Guid, Patient>(true, patient.Id, patient);
        }

        public FResult<Guid, Patient> UpdatePatient(Patient patient)
        {
            var fhirPatient = _mapper.ToPatientResource(patient);
            var updatedFhirPatient = UpdateFhirPatient(patient.FhirResourceId, fhirPatient);

            _mapper.EnrichEntity(patient, updatedFhirPatient);
            return new FResult<Guid, Patient>(true, patient.Id, patient);
        }

        public FResult<Guid, Patient> DeletePatient(Guid identifier)
        {
            var fhirPatient = _fhirRepository.SearchByIdentifier(ResourceType.Patient, identifier);
            _fhirRepository.Delete(fhirPatient.ResourceIdentity().WithoutVersion().ToString());
            return new FResult<Guid, Patient>(true);
        }

        public void EnrichPatient(ref Patient patient)
        {
            var fPatient = GetFhirPatient(patient.Id);
            _mapper.EnrichEntity(patient, fPatient);
        }

        public void EnrichPatient(ref List<Patient> data)
        {
            var fResourceIdLst = data.Select(x => x.Id).ToList();
            var fPatientLst = GetPatientLst(fResourceIdLst);

            foreach (var patient in data)
            {
                var fPatient = (Hl7.Fhir.Model.Patient) fPatientLst.DataHash[patient.Id];
                _mapper.EnrichEntity(patient, fPatient);
            }
        }


        private Hl7.Fhir.Model.Patient GetFhirPatient(
            Guid identifier, /*ICollection<ResourceType> resourceTypesToInclude*/ int versionId = 0)
        {
            var patient = (Hl7.Fhir.Model.Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient, identifier);
            return patient;
        }

        private Hl7.Fhir.Model.Patient CreateFhirPatient(Hl7.Fhir.Model.Patient patient)
        {
            var createdPatient = _fhirRepository.Create(patient);
            return createdPatient;
        }


        private Hl7.Fhir.Model.Patient UpdateFhirPatient(string id, Hl7.Fhir.Model.Patient patient)
        {
            var updatedPatient = _fhirRepository.Update(patient);
            return updatedPatient;
        }

        private FResult<Guid, Hl7.Fhir.Model.Patient> GetPatientLst(List<Guid> patientIdLst)
        {
            var result = new FResult<Guid, Hl7.Fhir.Model.Patient>(true);
            var fResourceLst = _fhirRepository.SearchByIdentifier(ResourceType.Patient, patientIdLst);

            foreach (var fPatient in fResourceLst)
                result.AddData(new Guid(((Hl7.Fhir.Model.Patient) fPatient).Identifier[0].Value),
                    (Hl7.Fhir.Model.Patient) fPatient);
            return result;
        }
    }
}