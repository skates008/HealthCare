using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CareTaskr.Authorization;
using Caretaskr.Common.Exceptions;
using Caretaskr.Common.Validators;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientController : ParentController
    {
        private readonly IBillingService _billingService;
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService, IBillingService billingService)
        {
            _patientService = patientService;
            _billingService = billingService;
        }


        #region Patient Observation

        [Route("{patientId}/observation")]
        [HttpPost]
        [Authorize(Policy = UserAction.PatientObservation.Create)]
        public IActionResult SaveObservation(SavePatientObservationViewModel model, Guid patientId)
        {
            model.PatientId = patientId;
            return Ok(_patientService.SaveObservation(CurrentUserId(), model));
        }

        #endregion

        #region Treatment Note

        /*
        [Route("{patientId}/treatmentnote")]
        [HttpPost]
        [Authorize(Policy = UserAction.PatientTreatmentNote.Create)]
        public IActionResult SaveTreatmentNote(Guid patientId, SavePatientTreatmentNoteViewModel model)
        {
            model.PatientId = patientId;
            return Ok(_patientService.SaveTreatmentNote(CurrentUserId(), model));
        }
        */
        #endregion

        #region Invoice

        [Route("{patientId}/invoice")]
        [HttpGet]
        //TODO:[Authorize(Policy = UserAction.in.Create)]
        public IActionResult GetInvoice(Guid patientId, [FromQuery(Name = "format")] string format)
        {
            if (!string.IsNullOrEmpty(format) && string.Compare(format.ToLower(), "pdf") == 0)
            {
                var file = _billingService.DownloadInvoice(CurrentUserId(), patientId);
                return File(file, "application/pdf");
            }

            return Ok(_billingService.GetInvoice(CurrentUserId(), patientId));
        }

        #endregion

        #region Files

        [Route("{patientId}/file/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetFiles(Guid patientId, DataRequestModel dataRequest)
        {
            return Ok(_patientService.GetFiles(CurrentUserId(), patientId, dataRequest));
        }

        #endregion


        #region Patient

        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Create)]
        public async Task<IActionResult> CreatePatient(PatientRegisterRequestViewModel model)
        {
            return Ok(await _patientService.CreatePatient(CurrentUserId(), model));
        }

        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult ListPatient(DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListPatient(CurrentUserId(), dataRequest));
        }


       

        [Route("{patientId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult UpdatePatient(UpdatePatientRequestViewModel model, Guid patientId)
        {
            model.Id = patientId;
            return Ok(_patientService.UpdatePatient(CurrentUserId(), model));
        }

        [Route("{patientId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetPatientById(Guid patientId)
        {
            return Ok(_patientService.GetPatientById(CurrentUserId(), patientId));
        }

        [Route("{patientId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Patient.Delete)]
        public IActionResult DeletePatient(Guid patientId)
        {
            return Ok(_patientService.DeletePatient(CurrentUserId(), patientId));
        }


        [Route("{patientId}/details")]
        [HttpGet]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetPatientDetailsById(Guid patientId)
        {
            return Ok(_patientService.GetPatientDetailsById(CurrentUserId(), patientId));
        }

        //my profile on patient page
        [Route("myprofile")]
        [HttpGet]
        public IActionResult GetLoggedInPatientDetails()
        {
            return Ok(_patientService.GetLoggedInPatientDetails(CurrentUserId()));
        }

        [Route("initRegistration")]
        [HttpGet]
        public async Task<IActionResult> InitRegistration()
        {
            return Ok(await _patientService.InitRegistration(CurrentUserId()));
        }

        [Route("registrationComplete")]
        [HttpPost]
        public async Task<IActionResult> RegistrationComplete(InitPatientRegistrationtViewModel model)
        {
            return Ok(await _patientService.RegistrationComplete(CurrentUserId(), model));
        }

        #endregion

        #region Medication

        [Route("medication")]
        [HttpPost]
        [Authorize(Policy = UserAction.Medication.Create)]
        public IActionResult CreateMedication(CreateMedicationRequestViewModel model)
        {
            return Ok(_patientService.CreateMedication(CurrentUserId(), model));
        }

        [Route("medication/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Medication.Read)]
        public IActionResult ListMedication(DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListMedication(CurrentUserId(), dataRequest));
        }

        [Route("medication/{medicationId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Medication.Delete)]
        public IActionResult DeleteMedication(Guid medicationId)
        {
            return Ok(_patientService.DeleteMedication(CurrentUserId(), medicationId));
        }

        #endregion

        #region Allergies

        [Route("allergy")]
        [HttpPost]
        [Authorize(Policy = UserAction.Allergy.Create)]
        public IActionResult CreateAllergy(CreateAllergiesRequestViewModel model)
        {
            return Ok(_patientService.CreateAllergies(CurrentUserId(), model));
        }

        [Route("allergy/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Allergy.Read)]
        public IActionResult ListAllergies(DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListAllergies(CurrentUserId(), dataRequest));
        }

        [Route("allergy/{allergyId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Allergy.Delete)]
        public IActionResult DeleteAllergy(Guid allergyId)
        {
            return Ok(_patientService.DeleteAllergy(CurrentUserId(), allergyId));
        }

        #endregion

        #region Budget

        [Route("budget")]
        [HttpPost]
        [Authorize(Policy = UserAction.Budget.Create)]
        public IActionResult CreateBudget(CreateBudgetViewModel model)
        {
            return Ok(_patientService.CreateBudget(CurrentUserId(), model));
        }

        [Route("budget/{budgetId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Budget.Delete)]
        public IActionResult DeleteBudget(Guid budgetId)
        {
            return Ok(_patientService.DeleteBudget(CurrentUserId(), budgetId));
        }

        [Route("budgets")]
        [HttpGet]
        [Authorize(Policy = UserAction.Budget.Read)]
        public IActionResult ListBudget()
        {
            return Ok(_patientService.ListBudgets(CurrentUserId()));
        }

        #endregion


        #region Careplan

        [Route("{patientId}/careplan")]
        [HttpPost]
        [Authorize(Policy = UserAction.Careplan.Create)]
        public IActionResult CreateCareplan(Guid patientId, CreateCarePlanViewModel model)
        {
            model.PatientId = patientId;
            return Ok(_patientService.CreateCarePlan(CurrentUserId(), model));
        }

        [Route("careplan/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Careplan.Read)]
        public IActionResult ListCarePlan(DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListCarePlan(CurrentUserId(), dataRequest));
        }


        [Route("{patientId}/careplan/{careplanId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Careplan.Update)]
        public IActionResult UpdateCareplan(Guid patientId, Guid careplanId, CarePlanViewModel model)
        {
            model.PatientId = patientId;
            model.Id = careplanId;
            return Ok(_patientService.UpdateCarePlan(CurrentUserId(), model));
        }

        [Route("{patientId}/careplan/{careplanId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Careplan.Delete)]
        public IActionResult DeleteCareplan(Guid patientId, Guid careplanId)
        {
            return Ok(_patientService.DeleteCarePlan(CurrentUserId(), patientId, careplanId));
        }

        //For edit
        [Route("{patientId}/careplan/{careplanId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Careplan.Read)]
        public IActionResult GetCarePlanById(Guid patientId, Guid careplanId)
        {
            return Ok(_patientService.GetCarePlanById(patientId, careplanId));
        }

        //Details
        [Route("{patientId}/careplandetails/{careplanId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Careplan.Read)]
        public IActionResult GetCarePlanDetailsById(Guid patientId, Guid careplanId)
        {
            return Ok(_patientService.GetCarePlanDetailsById(patientId, careplanId));
        }

        /* TODO:unclear requirements of what to do with this!
        [Route("{patientId}/careplan/{careplanId}/observation")]
        [HttpPost]
        [Authorize(Policy = UserAction.CareplanObservation.Create)]
        public IActionResult SaveObservation(Guid patientId, Guid careplanId, SaveCarePlanObservationViewModel model)
        {
            model.PatientId = patientId;
            model.CarePlanId = careplanId;

            return Ok(_patientService.SaveCarePlanObservation(CurrentUserId(), model));
        }


        [Route("{patientId}/careplan/{careplanId}/assessment")]
        [HttpPost]
        [Authorize(Policy = UserAction.CareplanAssessment.Create)]
        public IActionResult SaveAssessment(Guid patientId, Guid careplanId, SaveCarePlanAssessmentViewModel model)
        {
            model.PatientId = patientId;
            model.CarePlanId = careplanId;
            return Ok(_patientService.SaveCarePlanAssessment(CurrentUserId(), model));
        }


        [Route("{patientId}/careplan/{careplanId}/treatmentnote")]
        [HttpPost]
        [Authorize(Policy = UserAction.CareplanTreatmentNote.Create)]
        public IActionResult SaveTreatmentNote(Guid patientId, Guid careplanId,
            SaveCarePlanTreatmentNoteViewModel model)
        {
            model.PatientId = patientId;
            model.CarePlanId = careplanId;
            return Ok(_patientService.SaveCarePlanTreatmentNote(CurrentUserId(), model));
        }
        */

        [Authorize]
        [Route("{patientId}/careplan/{careplanId}/summaryReport")]
        [HttpGet]
        [Authorize(Policy = UserAction.CareplanReport.Read)]
        public IActionResult DownloadCarePlanSummaryReport(Guid careplanId)
        {
            var file = _patientService.CarePlanSummaryReport(CurrentUserId(), careplanId);
            return File(file, "application/pdf");
        }

        #endregion

        #region Assessment

        [Route("{patientId}/assessment")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult CreateAssessment(Guid patientId,
            [FromForm] string title,
            [FromForm] string notes,
            [FromForm] string assessor,
            [FromForm] DateTime assessmentDate,
            [FromForm] DateTime validFromDate,
            [FromForm] DateTime validToDate,
            [FromForm] List<string> fileTitles,
            [FromForm] IFormFile[] files)
        {
            var model = new AssesmentRequestViewModel
            {
                PatientId = patientId,
                Id = null,
                Title = title,
                Notes = notes,
                Assessor = assessor,
                AssessmentDate = assessmentDate,
                ValidFromDate = validFromDate,
                ValidToDate = validToDate
            };

            model.FilesToUpload = GetFiles(files, fileTitles);

            var result = new AssesmentValidator().Validate(model);
            if (result.Errors.Any()) throw new ValidationException(result.Errors.ToList());

            return Ok(_patientService.CreateUpdateAssesment(CurrentUserId(), model));
        }

        [Route("{patientId}/assessment/{assessmentId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult UpdateAssessment(Guid patientId, Guid assessmentId,
            [FromForm] string title,
            [FromForm] string notes,
            [FromForm] string assessor,
            [FromForm] DateTime assessmentDate,
            [FromForm] DateTime validFromDate,
            [FromForm] DateTime validToDate,
            [FromForm] List<string> fileTitles,
            [FromForm] IFormFile[] files)
        {
            var model = new AssesmentRequestViewModel
            {
                PatientId = patientId,
                Id = assessmentId,
                Title = title,
                Notes = notes,
                Assessor = assessor,
                AssessmentDate = assessmentDate,
                ValidFromDate = validFromDate,
                ValidToDate = validToDate
            };
            model.FilesToUpload = GetFiles(files, fileTitles);


            var result = new AssesmentValidator().Validate(model);
            if (result.Errors.Any()) throw new ValidationException(result.Errors.ToList());

            return Ok(_patientService.CreateUpdateAssesment(CurrentUserId(), model));
        }

        [Route("{patientId}/assessment/{assessmentId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult DeleteAssessment(Guid patientId, Guid assessmentId)
        {
            return Ok(_patientService.DeleteAssesment(CurrentUserId(), assessmentId));
        }

        [Route("{patientId}/assessment/{assessmentId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetAssessment(Guid patientId, Guid assessmentId)
        {
            return Ok(_patientService.GetAssesment(CurrentUserId(), assessmentId));
        }

        [Route("{patientId}/assessment/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetCarePlanDetailsById(Guid patientId, DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListAssesments(CurrentUserId(), patientId, dataRequest));
        }

        #endregion

        #region Service Agreement

        [Route("{patientId}/serviceAgreement")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult CreateServiceAgreement(Guid patientId, [FromForm] string title,
            [FromForm] string notes,
            [FromForm] DateTime signedDate,
            [FromForm] DateTime validFromDate,
            [FromForm] DateTime validToDate,
            [FromForm] List<string> fileTitles,
            [FromForm] IFormFile[] files)
        {
            var model = new ServiceAgreementRequestViewModel
            {
                PatientId = patientId,
                Id = null,
                Title = title,
                SignedDate = signedDate,
                ValidFromDate = validFromDate,
                ValidToDate = validToDate,
                Notes = notes
            };

            var result = new ServiceAgreementValidator().Validate(model);
            if (result.Errors.Any()) throw new ValidationException(result.Errors.ToList());

            model.FilesToUpload = GetFiles(files, fileTitles);


            return Ok(_patientService.CreateUpdateServiceAgreement(CurrentUserId(), model));
        }

        [Route("{patientId}/serviceAgreement/{serviceagreementId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult UpdateServiceAgreement(Guid patientId, Guid serviceagreementId,
            [FromForm] string title,
            [FromForm] string notes,
            [FromForm] DateTime signedDate,
            [FromForm] DateTime validFromDate,
            [FromForm] DateTime validToDate,
            [FromForm] List<string> fileTitles,
            [FromForm] IFormFile[] files)
        {
            var model = new ServiceAgreementRequestViewModel
            {
                PatientId = patientId,
                Id = serviceagreementId,
                Title = title,
                SignedDate = signedDate,
                ValidFromDate = validFromDate,
                ValidToDate = validToDate,
                Notes = notes
            };
            model.FilesToUpload = GetFiles(files, fileTitles);

            var result = new ServiceAgreementValidator().Validate(model);
            if (result.Errors.Any()) throw new ValidationException(result.Errors.ToList());

            return Ok(_patientService.CreateUpdateServiceAgreement(CurrentUserId(), model));
        }

        [Route("{patientId}/serviceAgreement/{serviceAgreementId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Patient.Update)]
        public IActionResult DeleteServiceAgreement(Guid patientId, Guid serviceAgreementId)
        {
            return Ok(_patientService.DeleteServiceAgreement(CurrentUserId(), serviceAgreementId));
        }

        [Route("{patientId}/serviceAgreement/{serviceAgreementId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetServiceAgreement(Guid patientId, Guid serviceAgreementId)
        {
            return Ok(_patientService.GetServiceAgreement(CurrentUserId(), serviceAgreementId));
        }

        [Route("{patientId}/serviceAgreement/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Patient.Read)]
        public IActionResult GetServiceAgreements(Guid patientId, DataRequestModel dataRequest)
        {
            return Ok(_patientService.ListServiceAgreements(CurrentUserId(), patientId, dataRequest));
        }

        #endregion
    }
}