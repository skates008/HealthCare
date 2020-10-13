using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IPatientService
    {
        #region Observation

        ResponseViewModel SaveObservation(Guid currentUserId, SavePatientObservationViewModel model);

        #endregion

        #region Note

        //ResponseViewModel SaveTreatmentNote(Guid currentUserId, SavePatientTreatmentNoteViewModel model);

        #endregion

        #region

        void SetCarer(Guid currentUserId, object model, Patient patient, out bool isNewCarer,
            out string randomPassword);

        #endregion

        #region Files

        DataSourceResult GetFiles(Guid guid, Guid patientId, DataRequestModel dataRequest);

        #endregion

        #region Patient

        Task<ResponseViewModel> CreatePatient(Guid currentUserId, PatientRegisterRequestViewModel model);
        ResponseViewModel UpdatePatient(Guid currentUserId, UpdatePatientRequestViewModel model);
        ResponseViewModel<PatientDetailsResponseViewModel> GetPatientDetailsById(Guid currentUserId, Guid id);
        ResponseViewModel<PatientResponseViewModel> GetPatientById(Guid currentUserId, Guid id);
        ResponseViewModel DeletePatient(Guid currentUserId, Guid patientId);
        DataSourceResult ListPatient(Guid currentUserId, DataRequestModel dataRequest);
        DataSourceResult ListPatientByCareplan(Guid currentUserId, DataRequestModel dataRequest);

        ResponseViewModel<PatientProfileResponseViewModel> GetLoggedInPatientDetails(Guid id);

        Task<ResponseViewModel<InitPatientRegistrationtViewModel>> InitRegistration(Guid currentUserId);

        Task<ResponseViewModel> RegistrationComplete(Guid currentUserId, InitPatientRegistrationtViewModel model);

        #endregion

        #region Medication

        ResponseViewModel CreateMedication(Guid currentUserId, CreateMedicationRequestViewModel model);

        DataSourceResult ListMedication(Guid currentUserId, DataRequestModel dataRequest);

        ResponseViewModel DeleteMedication(Guid currentUserId, Guid medicationId);

        #endregion

        #region Allergies

        ResponseViewModel CreateAllergies(Guid currentUserId, CreateAllergiesRequestViewModel model);

        DataSourceResult ListAllergies(Guid currentUserId, DataRequestModel dataRequest);

        ResponseViewModel DeleteAllergy(Guid currentUserId, Guid allergyId);

        #endregion

        #region Budget

        ResponseViewModel CreateBudget(Guid currentUserId, CreateBudgetViewModel model);
        ResponseViewModel DeleteBudget(Guid currentUserId, Guid budgetId);
        ResponseViewModel<List<ListBudgetViewModel>> ListBudgets(Guid currentUserId);

        #endregion

        #region Care Plan

        ResponseViewModel CreateCarePlan(Guid currentUserId, CreateCarePlanViewModel model,
            bool isDefaultCarePlan = false);

        ResponseViewModel ImportCarePlan(string documentUri);

        ResponseViewModel UpdateCarePlan(Guid currentUserId, CarePlanViewModel model);
        ResponseViewModel DeleteCarePlan(Guid currentUserId, Guid patientId, Guid careplanId);
        ResponseViewModel<CarePlanViewModel> GetCarePlanById(Guid patientId, Guid careplanId);
        ResponseViewModel<CarePlanDetailsViewModel> GetCarePlanDetailsById(Guid patientId, Guid careplanId);

        DataSourceResult ListCarePlan(Guid currentUserId,
            DataRequestModel dataRequest);


      //  ResponseViewModel SaveCarePlanObservation(Guid currentUserId, SaveCarePlanObservationViewModel model);

       // ResponseViewModel SaveCarePlanAssessment(Guid currentUserId, SaveCarePlanAssessmentViewModel model);

      //  ResponseViewModel SaveCarePlanTreatmentNote(Guid currentUserId, SaveCarePlanTreatmentNoteViewModel model);

        byte[] CarePlanSummaryReport(Guid currentUserId, Guid careplanId);

        #endregion

        #region Assessments

        ResponseViewModel CreateUpdateAssesment(Guid currentUserId, AssesmentRequestViewModel model);
        ResponseViewModel GetAssesment(Guid currentUserId, Guid assessmentId);
        DataSourceResult ListAssesments(Guid currentUserId, Guid patientID, DataRequestModel dataRequest);
        ResponseViewModel DeleteAssesment(Guid currentUserId, Guid assessmentId);

        #endregion


        #region Service Agreement

        ResponseViewModel CreateUpdateServiceAgreement(Guid currentUserId, ServiceAgreementRequestViewModel model);
        ResponseViewModel GetServiceAgreement(Guid currentUserId, Guid assessmentId);
        DataSourceResult ListServiceAgreements(Guid currentUserId, Guid patientID, DataRequestModel dataRequest);
        ResponseViewModel DeleteServiceAgreement(Guid currentUserId, Guid assessmentId);

        #endregion
    }
}