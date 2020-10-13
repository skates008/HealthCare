using System;
using System.Collections.Generic;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IFClinicalInfoService : IFService
    {
        #region Clinical Impression

        FResult<Guid, ClinicalImpression> CreateClinicalImpression(ClinicalImpression clinicalImpression);
        FResult<Guid, ClinicalImpression> GetClinicalImmpressions(List<Guid> clinicalImpressionIdLst);
        FResult<Guid, ClinicalImpression> DeleteClinicalImpression(Guid clinicalImpressionId);

        #endregion


        #region Allergies

        FResult<Guid, Allergies> CreateAllergy(Allergies allergy);
        FResult<Guid, Allergies> GetAllergies(Guid patientId);
        FResult<Guid, Allergies> GetAllergy(Guid allergyId);
        FResult<Guid, Allergies> GetAllergy(List<Guid> allergyIds);
        FResult<Guid, Allergies> DeleteAllergy(Guid allergyId);

        #endregion
    }
}