using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.FHIR.Data;
using CareTaskr.FHIR.Mappers;
using CareTaskr.Service.Interface;
using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;
using static Hl7.Fhir.Model.ClinicalImpression;
using ClinicalImpression = CareTaskr.Domain.Entities.ClinicalImpression;
using Patient = Hl7.Fhir.Model.Patient;

namespace CareTaskr.Service.Service
{
    public class FClinicalInfoService : IFClinicalInfoService
    {
        private readonly FhirRepository _fhirRepository;
        private readonly FClinicalImpressionMapper _mapper;


        public FClinicalInfoService(IFRepository fhirRepository, IMapper mapper)
        {
            _fhirRepository = (FhirRepository) fhirRepository;
            _mapper = new FClinicalImpressionMapper(_fhirRepository);
        }

        #region Clinical Impression

        public FResult<Guid, ClinicalImpression> CreateClinicalImpression(ClinicalImpression clinicalImpression)
        {
            var fclinicalImpression = _mapper.ToClinicalImpressionResource(clinicalImpression);
            fclinicalImpression = _fhirRepository.Create(fclinicalImpression);

            clinicalImpression.FhirResourceId = fclinicalImpression.Id;
            clinicalImpression.FhirResourceUri = fclinicalImpression.ResourceIdentity().WithoutVersion().ToString();

            return new FResult<Guid, ClinicalImpression>(true, clinicalImpression.Id, clinicalImpression);
        }


        public FResult<Guid, ClinicalImpression> GetClinicalImmpressions(List<Guid> clinicalImpressionIdLst)
        {
            var result = new FResult<Guid, ClinicalImpression>(true);
            var fResourceLst =
                _fhirRepository.SearchByIdentifier(ResourceType.ClinicalImpression, clinicalImpressionIdLst);

            foreach (var fClinicalImpression in fResourceLst)
                result.AddData(new Guid(((Hl7.Fhir.Model.ClinicalImpression) fClinicalImpression).Identifier[0].Value),
                    _mapper.ToClinicalImpressionEntity((Hl7.Fhir.Model.ClinicalImpression) fClinicalImpression));
            return result;
        }

        public FResult<Guid, ClinicalImpression> DeleteClinicalImpression(Guid clinicalImpressionId)
        {
            var fClinicalImpression =
                (Hl7.Fhir.Model.ClinicalImpression) _fhirRepository.SearchByIdentifier(ResourceType.ClinicalImpression,
                    clinicalImpressionId);
            fClinicalImpression.Status = ClinicalImpressionStatus.EnteredInError;
            fClinicalImpression = _fhirRepository.Update(fClinicalImpression);
            return new FResult<Guid, ClinicalImpression>(true);
        }

        #endregion

        #region Allergies - http: //hl7.org/fhir/allergyintolerance.html

        public FResult<Guid, Allergies> CreateAllergy(Allergies allergy)
        {
            var allergyIntolerance = _mapper.ToAllergyIntoleranceResource(allergy);
            allergyIntolerance = _fhirRepository.Create(allergyIntolerance);

            allergy.FhirResourceId = allergyIntolerance.Id;
            allergy.FhirResourceUri = allergyIntolerance.ResourceIdentity().WithoutVersion().ToString();

            return new FResult<Guid, Allergies>(true, allergy.Id, allergy);
        }

        public FResult<Guid, Allergies> GetAllergies(Guid patientId)
        {
            var allergyLst = new List<Allergies>();
            var patient = (Patient) _fhirRepository.SearchByIdentifier(ResourceType.Patient, patientId);
            if (patient != null)
            {
                var p = new SearchParams();
                //p.Add("patient", patient.ResourceIdentity().WithoutVersion().ToString());

                var bundle = _fhirRepository.Search(p, ResourceType.AllergyIntolerance);

                foreach (var entry in bundle.Entry)
                {
                    var entity = _mapper.ToAllergyIntoleranceEntity((AllergyIntolerance) entry.Resource);
                    allergyLst.Add(entity);
                }
            }

            return new FResult<Guid, Allergies>(true, allergyLst);
        }


        private List<Resource> GetFAllergyIntolerance(List<Guid> identifierLst)
        {
            return _fhirRepository.SearchByIdentifier(ResourceType.AllergyIntolerance, identifierLst);
        }

        private List<Resource> GetFAllergyIntolerance(Guid identifier)
        {
            return GetFAllergyIntolerance(new List<Guid> {identifier});
        }


        public void enrich<TEntity>(TEntity entity) where TEntity : class
        {
            if (typeof(TEntity) == typeof(Allergies))
            {
                var allergy = entity;
                //var fAllergyIntolerance = GetFAlleryIntolerance(((Allergies)entity).Id);
                //EnrichAllergies((Allergies)entity, );
            }
        }

        public FResult<Guid, Allergies> GetAllergy(Guid allergyId)
        {
            var fAllergyIntoleranceLst = GetFAllergyIntolerance(allergyId);
            return new FResult<Guid, Allergies>(true, allergyId,
                _mapper.ToAllergyIntoleranceEntity((AllergyIntolerance) fAllergyIntoleranceLst[0]));
        }

        public FResult<Guid, Allergies> GetAllergy(List<Guid> allergyIdLst)
        {
            var result = new FResult<Guid, Allergies>(true);
            var fAllergyIntoleranceLst = GetFAllergyIntolerance(allergyIdLst);
            foreach (var fAllergyIntolerance in fAllergyIntoleranceLst)
                result.AddData(new Guid(((AllergyIntolerance) fAllergyIntolerance).Identifier[0].Value),
                    _mapper.ToAllergyIntoleranceEntity((AllergyIntolerance) fAllergyIntolerance));
            return result;
        }

        public FResult<Guid, Allergies> DeleteAllergy(Guid allergyId)
        {
            var fAllergy =
                (AllergyIntolerance) _fhirRepository.SearchByIdentifier(ResourceType.AllergyIntolerance, allergyId);
            fAllergy.ClinicalStatus =
                new CodeableConcept("http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", "inactive",
                    "inactive");
            fAllergy = _fhirRepository.Update(fAllergy);
            return new FResult<Guid, Allergies>(true);
        }

        #endregion
    }
}