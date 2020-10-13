using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Constant;
using Caretaskr.Common.Extension;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using EWSoftware.PDI;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace CareTaskr.Service.Service
{
    public class AppointmentService : ParentService, IAppointmentService
    {
        private readonly IBillingService _billingService;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly INoteService _noteService;
        private readonly IFWorkflowService _fhirWorkflowService;
        private readonly ViewRender _viewRender;
        private readonly IEmailService _emailService;
        private readonly CareTaskrUrl _careTaskrUrls;

        public AppointmentService(IGenericUnitOfWork genericUnitOfWork, IMapper mapper,
            IFWorkflowService fhirWorkflowService
            , IBillingService billingService, INoteService noteService,

            IOptions<CareTaskrUrl> careTaskrUrls,
            IEmailService emailService, ViewRender viewRender) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
            _fhirWorkflowService = fhirWorkflowService;
            _billingService = billingService;
            _noteService = noteService;
            _viewRender = viewRender;
            _emailService = emailService;
            _careTaskrUrls = careTaskrUrls.Value;
        }

        public ResponseViewModel CreateAppointment(Guid currentUserId, CreateAppointmentRequestViewModel model, AppointmentRecurrenceGroup reccurrenceGroup = null)
        {
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointments = new List<Appointment>();
            Appointment appointment;

            var instances = new List<DateTime>() { (DateTime)model.StartTime };

            if (model.Recurrence != null)
            {
                instances = GetInstances((DateTime)model.StartTime, model.Recurrence.RRule);
                if (instances.Count() > 100)
                {
                    throw new ArgumentException(ErrorMessage.APPOINTMENT_RECCURRENCE_LIMIT);
                }

                if(reccurrenceGroup == null)
                {
                    reccurrenceGroup = new AppointmentRecurrenceGroup()
                    {
                        CreatedDate = GeneralService.CurrentDate,
                        CreatedById = currentUserId,
                    };
                }

                reccurrenceGroup.Rrule = model.Recurrence.RRule;
                reccurrenceGroup.FirstInstance = instances.FirstOrDefault();
                reccurrenceGroup.LastInstance = instances.LastOrDefault();

            }

            var duration = (TimeSpan)(model.EndTime - model.StartTime);

            foreach (var instanceDateTime in instances) {

                var instanceStartTime = instanceDateTime;
                var instanceEndTime = instanceStartTime.AddMinutes(duration.TotalMinutes);


                Expression<Func<Appointment, bool>> participationExistsExpresssion = c =>
                    c.PatientRecord.Patient.PublicId == model.PatientId
                    && c.AppointmentDate.Date == model.AppointmentDate.Date;

                Expression<Func<Appointment, bool>> practionerExistsExpresssion = c =>
                    c.PractitionerId == model.PractitionerId
                    && c.AppointmentDate.Date == model.AppointmentDate.Date;


                bool appointmetParticipationExists = CheckParticipationAppointment(instanceStartTime, instanceEndTime, participationExistsExpresssion);
                bool appointmetPractionerExists = CheckPractionerAppointment(instanceStartTime, instanceEndTime, practionerExistsExpresssion);

                if (appointmetPractionerExists)
                    throw new ArgumentException(ErrorMessage.PRACTITIONER_APPOINTMENT_EXISTS);

                if (appointmetParticipationExists)
                    throw new ArgumentException(ErrorMessage.PARTICIPANT_APPOINTMENT_EXISTS);

         

                var user = _genericUnitOfWork.GetRepository<User, Guid>().FirstOrDefault(x => x.Id == currentUserId);


                appointment = _mapper.Map<CreateAppointmentRequestViewModel, Appointment>(model);

                appointment.CreatedDate = GeneralService.CurrentDate;
                appointment.CreatedById = currentUserId;
                appointment.PatientRecord = GetPatientRecord(currentUserId, model.PatientId);
                appointment.AppointmentTypeId = GetInternalId<AppointmentType, int>((Guid)model.AppointmentTypeId);

                appointment.RecurrenceGroup = reccurrenceGroup;
                appointment.AppointmentDate = instanceDateTime;
                appointment.StartTime = instanceStartTime;
                appointment.EndTime = instanceEndTime;


                if (user.UserType == UserType.Client)
                    appointment.AppointmentStatus = AppointmentStatus.Pending;
                else
                    appointment.AppointmentStatus = AppointmentStatus.Confirmed;

                appointmentRepo.Add(appointment);

                //FHIR ---
                var result = _fhirWorkflowService.CreateAppointment(appointment);
                if (result.Success)
                {
                    appointment.FhirResourceId = result.DataFirstItem().FhirResourceId;
                    appointment.FhirResourceUri = result.DataFirstItem().FhirResourceUri;
                }
                else
                {
                    throw new ArgumentException("Unable to save Patient data on FHIR Server");
                }
                //FHIR --/

                appointments.Add(appointment);
            }

            _genericUnitOfWork.SaveChanges();

            appointment = appointments.FirstOrDefault();

            #region Send  Email For Practitioner

            var practitionerInfo = GetUser(appointment.PractitionerId);
            var participantInfo = appointment.PatientRecord.Patient.User;
            var emailModel = new AppointmentNotificationViewModel
            {
                PractitionerName = practitionerInfo.FullName,
                ParticipantName = participantInfo.FullName,
                StartTime = appointment.StartTime.Value.ToString("hh:mm tt"),
                EndTime = appointment.EndTime.Value.ToString("hh:mm tt"),
                Address = model.Address,
                AppointmentDate = model.AppointmentDate.ToString("dd MMMM yyyy"),
                //Todo find new way to send image to template
                LogoUrl = _careTaskrUrls.WebUrl + ImageConstant.LOGO_URL,
                WebUrl = _careTaskrUrls.WebUrl

            };


            SendAppointmentEmailNotification(practitionerInfo.Email, emailModel, SENDGRIDEMAILTEMPLATE.APPOINTMENT_NOTIFICATION_PRACTITIONER);
            SendAppointmentEmailNotification(participantInfo.Email, emailModel, SENDGRIDEMAILTEMPLATE.APPOINTMENT_NOTIFICATION_PARTICIPANT);

            #endregion

            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointment), Success = true };
        }

        private void SendAppointmentEmailNotification(string email, dynamic emailModel, string template)
        {
            //var htmlParticipant = _viewRender.Render(template, emailModel);
            //_emailService.SendEmailAsync(email, subject, htmlParticipant);
            _emailService.SendEmailDynamicTemplate(email, template, emailModel);
        }



        public ResponseViewModel UpdateAppointment(Guid currentUserId, UpdateAppointmentRequestViewModel model)
        {
            var cannotUpdateStatus = new Enum[]
            {
                AppointmentStatus.Canceled,
                AppointmentStatus.CheckedIn,
                AppointmentStatus.CheckedOut,
                AppointmentStatus.Rejected,
                AppointmentStatus.Completed
            };

            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.AppointmentId);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            if (cannotUpdateStatus.Contains(appointmentEntity.AppointmentStatus))
                throw new ArgumentException("Cannot Update Appointment");


            var instanceStartTime = (DateTime)model.StartTime;
            var instanceEndTime = (DateTime)model.EndTime;
            var duration = (TimeSpan)(model.EndTime - model.StartTime);


            var appointmentsToDelete = new List<Appointment>();
            var appointmentsToUpdate = new List<Appointment>() { appointmentEntity };

            if (model.Recurrence != null && model.Recurrence.isException) {
                appointmentEntity.IsRecurrenceException = true;
            }

            if (appointmentEntity.GetIsRecurring() && !appointmentEntity.IsRecurrenceException)
            {
                //update self and all future appointments of the same group

                //check if recurrence rule changed
                if (model.Recurrence.RRule != appointmentEntity.RecurrenceGroup.Rrule)
                {

                    //delete future events (including exceptions)
                    appointmentsToDelete = appointmentEntity.RecurrenceGroup.Appointments.Where(x => x != appointmentEntity && x.StartTime >= appointmentEntity.StartTime).ToList();

                    //create new ones (ignoring the current one)
                    if (model.Recurrence != null && !String.IsNullOrWhiteSpace(model.Recurrence.RRule))
                    {
                        var instances = GetInstances(instanceStartTime, model.Recurrence.RRule);

                        instanceStartTime = instances.First();
                        instanceEndTime = instanceStartTime.AddMinutes(duration.TotalMinutes);

                        if (instances.Count() > 1)
                        {
                            model.StartTime = instances.Skip(1).First();
                            CreateAppointment(currentUserId, _mapper.Map<CreateAppointmentRequestViewModel>(model), appointmentEntity.RecurrenceGroup);
                        }
                    }
                }
                else {
                    appointmentsToUpdate = GetInstancesForUpdate(appointmentEntity);
                }
            }

            Expression<Func<Appointment, bool>> participationExistsExpresssion = c =>
                c.PublicId != model.AppointmentId &&
                c.PatientRecord.Patient.PublicId == model.PatientId
                && c.AppointmentDate.Date == model.AppointmentDate.Date;

            Expression<Func<Appointment, bool>> practionerExistsExpresssion = c =>
                c.PublicId != model.AppointmentId && c.PractitionerId == model.PractitionerId
                                                  && c.AppointmentDate.Date == model.AppointmentDate.Date;

            bool appointmetParticipationExists = CheckParticipationAppointment(instanceStartTime, instanceEndTime, participationExistsExpresssion);
            bool appointmetPractionerExists = CheckPractionerAppointment(instanceStartTime, instanceEndTime, practionerExistsExpresssion);

            if (appointmetPractionerExists)
                throw new ArgumentException(ErrorMessage.PRACTITIONER_APPOINTMENT_EXISTS);

            if (appointmetParticipationExists)
                throw new ArgumentException(ErrorMessage.PARTICIPANT_APPOINTMENT_EXISTS);


            var prevAppointmentDate = appointmentEntity.AppointmentDate;
            var prevParticipantId = appointmentEntity.PatientRecord.Patient.PublicId;
            var prevPractitionerId = appointmentEntity.PractitionerId;

            foreach (var appointment in appointmentsToUpdate)
            {
                var appointmentDate = (DateTime)appointment.StartTime;
                _mapper.Map(model, appointment);
                appointment.AppointmentDate = new DateTime(appointmentDate.Year, appointmentDate.Month, appointmentDate.Day,instanceStartTime.Hour, instanceStartTime.Minute, 0);
                appointment.StartTime = new DateTime(appointmentDate.Year, appointmentDate.Month, appointmentDate.Day, instanceStartTime.Hour, instanceStartTime.Minute, 0);
                appointment.EndTime = new DateTime(appointmentDate.Year, appointmentDate.Month, appointmentDate.Day, instanceEndTime.Hour, instanceEndTime.Minute, 0);
                appointment.PatientRecord = GetPatientRecord(currentUserId, model.PatientId);
                appointment.AppointmentTypeId = GetInternalId<AppointmentType, int>((Guid)model.AppointmentTypeId);
                appointment.ModifiedById = currentUserId;
                appointment.ModifiedDate = GeneralService.CurrentDate;

                appointmentRepo.Update(appointment);
            }


            _genericUnitOfWork.SaveChanges();

            //delete old recurrence appointments
            appointmentsToDelete.ForEach(x => DeleteEntity<Appointment, int>(currentUserId, x.PublicId));

            #region Send  Email 

            var practitionerInfo = GetUser(appointmentsToUpdate.First().PractitionerId);
            var participantInfo = appointmentsToUpdate.First().PatientRecord.Patient.User;
            var emailModel = new AppointmentUpdateNotificationViewModel
            {
                PractitionerName = practitionerInfo.FullName,
                ParticipantName = participantInfo.FullName,
                StartTime = appointmentsToUpdate.First().StartTime.Value.ToString("hh:mm tt"),
                EndTime = appointmentsToUpdate.First().EndTime.Value.ToString("hh:mm tt"),
                Address = model.Address,
                AppointmentDate = model.AppointmentDate.ToString("dd MMMM yyyy"),
                PrevAppointmentDate = prevAppointmentDate.ToString("dd MMMM yyyy"),

                //Todo find new way to send image to template
                LogoUrl = _careTaskrUrls.WebUrl + ImageConstant.LOGO_URL,
                WebUrl = _careTaskrUrls.WebUrl


            };


            if (model.PractitionerId == prevPractitionerId)
                SendAppointmentEmailNotification(practitionerInfo.Email, emailModel, SENDGRIDEMAILTEMPLATE.APPOINTMENT_UPDATE_NOTIFICATION_PRACTITIONER);

            else SendAppointmentEmailNotification(practitionerInfo.Email, emailModel, SENDGRIDEMAILTEMPLATE.APPOINTMENT_NOTIFICATION_PRACTITIONER);

            if (model.PatientId == prevParticipantId)
                SendAppointmentEmailNotification(participantInfo.Email, emailModel, SENDGRIDEMAILTEMPLATE.APPOINTMENT_UPDATE_NOTIFICATION_PARTICIPANT);
            else SendAppointmentEmailNotification(participantInfo.Email, emailModel, SENDGRIDEMAILTEMPLATE.APPOINTMENT_NOTIFICATION_PARTICIPANT);
            #endregion

            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointmentEntity), Success = true };
        }

        private bool CheckPractionerAppointment(DateTime? StartTime, DateTime? EndTime, Expression<Func<Appointment, bool>> practionerExistsExpresssion)
        {
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            return appointmentRepo.GetAll(practionerExistsExpresssion).Any(s => (s.StartTime >= StartTime && s.StartTime <= EndTime) ||
                                          (s.EndTime <= EndTime && s.EndTime >= StartTime));
        }

        private bool CheckParticipationAppointment(DateTime? StartTime, DateTime? EndTime, Expression<Func<Appointment, bool>> participationExistsExpresssion)
        {
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            return appointmentRepo.GetAll(participationExistsExpresssion).Any(s => (s.StartTime >= StartTime && s.StartTime <= EndTime) ||
                              (s.EndTime <= EndTime && s.EndTime >= StartTime));
        }



        public ResponseViewModel<List<ListAppointmentResponseViewModel>> ListPendingAppointment(Guid currentUserId)
        {
            Expression<Func<Appointment, bool>> expression = c => c.AppointmentStatus == AppointmentStatus.Pending;

            var queryable = _genericUnitOfWork.GetRepository<Appointment, int>().GetAll(expression).ToList();
            var result = _mapper.Map<List<Appointment>, List<ListAppointmentResponseViewModel>>(queryable);

            return new ResponseViewModel<List<ListAppointmentResponseViewModel>> { Data = result, Success = true };
        }


        public ResponseViewModel<List<ListAppointmentResponseViewModel>> ListAppointmentByDate(Guid currentUserId,
            AppointmentListRequestViewModel model)
        {
            //refactor
            if (model.Results == 0)
            {
                model.Results = int.MaxValue;
            }
            else if (model.Results > 0)
            {
                model.StartDate = DateTime.Today;
                model.EndDate = DateTime.MaxValue;
            }
            else
            {
                model.StartDate = DateTime.MinValue;
                model.EndDate = DateTime.Today;
            }


            Expression<Func<Appointment, bool>> expression = c =>
                c.AppointmentDate.Date >= model.StartDate.Date && c.AppointmentDate.Date <= model.EndDate.Date
                                                               && c.AppointmentStatus != AppointmentStatus.Canceled;




            if (!(model.PractitionerId == Guid.Empty || model.PractitionerId == null))
            {
                Expression<Func<Appointment, bool>> practitionerExpression =
                    c => c.PractitionerId == model.PractitionerId;
                expression = ExpressionBuilder.AndExpression(expression, practitionerExpression);
            }

            if (!(model.ParticipantId == Guid.Empty || model.ParticipantId == null))
            {
                Expression<Func<Appointment, bool>> participantExpression =
                    c => c.PatientRecord.Patient.PublicId == model.ParticipantId;
                expression = ExpressionBuilder.AndExpression(expression, participantExpression);
            }


            return GetAppointments(currentUserId, expression, model.Results);
        }


        public ResponseViewModel<List<ListAppointmentResponseViewModel>> ListUpcomingAppointment(Guid currentUserId)
        {
            //refactor
            var todaysDate = GeneralService.CurrentDate;
       

            Expression<Func<Appointment, bool>> expression = c => c.AppointmentDate.Date >= todaysDate.Date &&
                                                                  (c.AppointmentStatus ==
                                                                    AppointmentStatus.Confirmed);
            return GetAppointments(currentUserId, expression);
        }


        public ResponseViewModel RescheduleAppointment(Guid currentUserId, AppointmentActionRequestViewModel model)
        {
            var cannotUpdateStatus = new Enum[]
            {
                AppointmentStatus.Canceled,
                AppointmentStatus.CheckedIn,
                AppointmentStatus.CheckedOut,
                AppointmentStatus.Rejected,
                AppointmentStatus.Completed
            };

            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.Id);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            if (cannotUpdateStatus.Contains(appointmentEntity.AppointmentStatus))
                throw new ArgumentException("Cannot Update Appointment");

            Expression<Func<Appointment, bool>> participationExistsExpresssion = c =>
                c.PublicId != model.Id &&
                c.PatientRecord.Patient.PublicId == model.PatientId
                && c.AppointmentDate.Date == model.AppointmentDate.Date;

            Expression<Func<Appointment, bool>> practionerExistsExpresssion = c =>
                c.PublicId != model.Id && c.PractitionerId == model.PractitionerId
                                       && c.AppointmentDate.Date == model.AppointmentDate.Date;


            var appointmetParticipationExists = appointmentRepo.GetAll(participationExistsExpresssion).Any(s =>
                s.StartTime >= model.StartTime && s.StartTime <= model.EndTime ||
                s.EndTime <= model.EndTime && s.EndTime >= model.StartTime);

            var appointmetPractionerExists = appointmentRepo.GetAll(practionerExistsExpresssion).Any(s =>
                s.StartTime >= model.StartTime && s.StartTime <= model.EndTime ||
                s.EndTime <= model.EndTime && s.EndTime >= model.StartTime);

            if (appointmetPractionerExists)
                throw new ArgumentException(ErrorMessage.PRACTITIONER_APPOINTMENT_EXISTS);

            if (appointmetParticipationExists)
                throw new ArgumentException(ErrorMessage.PARTICIPANT_APPOINTMENT_EXISTS);


            appointmentEntity.AppointmentDate = model.AppointmentDate;
            appointmentEntity.StartTime = model.AppointmentDate.Date + new TimeSpan(model.StartTime.Value.Hour,
                model.StartTime.Value.Minute, model.StartTime.Value.Second);

            appointmentEntity.EndTime = model.AppointmentDate.Date + new TimeSpan(model.EndTime.Value.Hour,
                model.EndTime.Value.Minute, model.EndTime.Value.Second);
            appointmentEntity.RescheduleReason = model.RescheduleReason;
            appointmentEntity.ModifiedById = currentUserId;
            appointmentEntity.ModifiedDate = currentDate;
            appointmentRepo.Update(appointmentEntity);
            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointmentEntity), Success = true };
        }

        public ResponseViewModel UpdateAppointmentStatus(Guid currentUserId, AppointmentActionRequestViewModel model)
        {
            //TODO: Validate to which statuses the user is allowed to change - can a cancelled appointment be updated to accepted??


            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.Id);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            if (model.Recurrence != null && model.Recurrence.isException) {
                appointmentEntity.IsRecurrenceException = true;
                appointmentRepo.Update(appointmentEntity);
            }

            var appointmentsToUpdate = GetInstancesForUpdate(appointmentEntity);
            foreach (var appointment in appointmentsToUpdate) {

                if (model.Action == AppointmentAction.Accept)
                    appointment.AppointmentStatus = AppointmentStatus.Confirmed;
                else if (model.Action == AppointmentAction.Reject)
                    appointment.AppointmentStatus = AppointmentStatus.Rejected;
                else if (model.Action == AppointmentAction.Cancel)
                    appointment.AppointmentStatus = AppointmentStatus.Canceled;
                else
                    throw new ArgumentException("Unauthorised appointment action");


                appointment.ModifiedById = currentUserId;
                appointment.ModifiedDate = GeneralService.CurrentDate;

                if (appointment.AppointmentStatus == AppointmentStatus.Canceled)
                {
                    appointment.CancelAppointmentReason = model.CancelAppointmentReason;
                    appointment.CancelNotes = model.CancelNotes;
                }
                else
                {
                    //if satus transition sis validated, this might not be needed in the future
                    appointment.CancelAppointmentReason = null;
                    appointment.CancelNotes = string.Empty;
                }

                appointmentRepo.Update(appointment);
            }



            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<ListAppointmentResponseViewModel>
            { Data = _mapper.Map<ListAppointmentResponseViewModel>(appointmentsToUpdate.FirstOrDefault()), Success = true };
        }


        public ResponseViewModel<AppointmentResponseViewModel> GetAppointmentById(Guid currentUserId,
            Guid appointmentPublicId)
        {
            //TODO: validade if user has access to appointment
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == appointmentPublicId);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");


            var result = _mapper.Map<Appointment, AppointmentResponseViewModel>(appointmentEntity);

            return new ResponseViewModel<AppointmentResponseViewModel> { Data = result, Success = true };
        }
        /*
        public ResponseViewModel SaveObservation(Guid currentUserId, SaveObservationViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointmentNoteRepo = _genericUnitOfWork.GetRepository<AppointmentNote, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.AppointmentId);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            var appointmentNote = new AppointmentNote
            {
                Appointment = appointmentEntity,
                //PatientId = appointmentEntity.PatientId,
                NoteType = NoteType.Observation.ToString(),
                NoteTypeId = NoteType.Observation,
                Note = model.Observation,
                CreatedDate = currentDate,
                CreatedById = currentLoginUserId
            };

            appointmentNoteRepo.Add(appointmentNote);
            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentObservationViewModel>
                {Data = _mapper.Map<AppointmentObservationViewModel>(appointmentNote), Success = true};
        }

        public ResponseViewModel SaveAssessment(Guid currentUserId, SaveAssessmentViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointmentNoteRepo = _genericUnitOfWork.GetRepository<AppointmentNote, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.AppointmentId);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            var appointmentNote = new AppointmentNote
            {
                Appointment = appointmentEntity,
                //PatientId = appointmentEntity.PatientId,
                NoteType = NoteType.Assessment.ToString(),
                NoteTypeId = NoteType.Assessment,
                Note = model.Assessment,
                CreatedDate = currentDate,
                CreatedById = currentLoginUserId
            };

            appointmentNoteRepo.Add(appointmentNote);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentAssessmentViewModel>
                {Data = _mapper.Map<AppointmentAssessmentViewModel>(appointmentNote), Success = true};
        }

        public ResponseViewModel SaveTreatmentNote(Guid currentUserId, SaveTreatmentNoteViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;
            var appointmentNoteRepo = _genericUnitOfWork.GetRepository<AppointmentNote, int>();

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.AppointmentId);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exist");

            var appointmentNote = new AppointmentNote
            {
                Appointment = appointmentEntity,
                //PatientId = appointmentEntity.PatientId,
                NoteType = NoteType.TreatmentNote.ToString(),
                NoteTypeId = NoteType.TreatmentNote,
                Note = model.TreatmentNote,
                CreatedDate = currentDate,
                CreatedById = currentLoginUserId
            };

            appointmentNoteRepo.Add(appointmentNote);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentTreatmentNoteViewModel>
                {Data = _mapper.Map<AppointmentTreatmentNoteViewModel>(appointmentNote), Success = true};
        }
        */
        public ResponseViewModel FinalizeAppointment(Guid currentUserId, AppointmentActionRequestViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var appointmentFeedbackRepo = _genericUnitOfWork.GetRepository<AppointmentFeedBack, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.Id);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            //if (appointmentEntity.AppointmentDate > currentDate)
            //    throw new ArgumentException("Cannot finalize Future Appointment Date");

            if (appointmentEntity.AppointmentStatus != AppointmentStatus.CheckedOut)
                throw new ArgumentException("Cannot Finalize Appointment");

            appointmentEntity.AppointmentStatus = AppointmentStatus.Completed;

            var noteId =
                ((ResponseViewModel<NoteViewModel>)_noteService.CreateNote(currentUserId, new NoteRequestViewModel
                {
                    PatientId = model.PatientId,
                    AppointmentId = appointmentEntity.PublicId,
                    Text = model.ExternalNote,
                    Type = NoteType.External,
                    CareplanId = model.TimeEntry.CareplanId,

                })).Data.Id;

            appointmentEntity.ExternalNoteId = GetInternalId<Note, int>((Guid)noteId);

            appointmentEntity.ModifiedDate = currentDate;
            appointmentEntity.ModifiedById = currentLoginUserId;


            appointmentRepo.Update(appointmentEntity);

            #region TimeEntry

            _billingService.CreateTimeEntry(currentUserId, model.TimeEntry);

            #endregion

            //Save changes will call on timeentry create
            //_genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointmentEntity), Success = true };
        }

        public ResponseViewModel<List<ListAppointmentResponseViewModel>> ListAppointmentTimeLineView(Guid currentUserId,
            AppointmentListRequestViewModel model)
        {
            Expression<Func<Appointment, bool>> expression = c =>
                c.AppointmentDate.Date >= model.StartDate.Date && c.AppointmentDate.Date <= model.EndDate.Date
                                                               && c.AppointmentStatus != AppointmentStatus.Canceled;

            Expression<Func<TeamUser, bool>> teamExpression = c => c.IsActive;
            if (!(model.TeamId == Guid.Empty || model.TeamId == null))
            {
                Expression<Func<TeamUser, bool>> teamExpression1 = c => c.Team.PublicId == model.TeamId;
                teamExpression = ExpressionBuilder.AndExpression(teamExpression, teamExpression1);
            }

            if (!(model.PractitionerId == Guid.Empty || model.PractitionerId == null))
            {
                Expression<Func<Appointment, bool>> userExpression = c => c.PractitionerId == model.PractitionerId;
                expression = ExpressionBuilder.AndExpression(expression, userExpression);
            }


            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>().GetAll(expression);

            var teamUser = _genericUnitOfWork.GetRepository<TeamUser, Guid>().GetAll(teamExpression);

            var result = appointmentRepo.Join(teamUser //For Team Events
                , a => a.Practitioner.Id,
                tu => tu.UserId, (a, tu) => new
                {
                    Appointment = a,
                    TeamUser = tu
                }).Select(c => new ListAppointmentResponseViewModel
                {
                    Id = c.Appointment.PublicId,
                    PractitionerId = c.Appointment.PractitionerId,
                    PractitionerName = c.Appointment.Practitioner.FullName,
                    PatientName = c.Appointment.PatientRecord.Patient.User.FullName,
                    PatientId = c.Appointment.PatientRecord.Patient.PublicId,
                    Address = c.Appointment.Address == null ? new AddressViewModel() : _mapper.Map<AddressViewModel>(c.Appointment.Address),
                    StartTime = c.Appointment.StartTime,
                    EndTime = c.Appointment.EndTime,
                    Note = c.Appointment.Note,
                    AppointmentDate = c.Appointment.AppointmentDate,
                    AppointmentStatus = c.Appointment.AppointmentStatus,
                    CancelAppointmentReason = c.Appointment.CancelAppointmentReason,
                    ResourceId = c.TeamUser.Team.Name,
                    AppointmentTypeId = c.Appointment.AppointmentType.PublicId
                }).ToList();

            //For Individual Events

            var resultIndividual = appointmentRepo.Join(teamUser
                , a => a.Practitioner.Id,
                tu => tu.UserId, (a, tu) => new
                {
                    Appointment = a,
                    TeamUser = tu
                }).Select(c => new ListAppointmentResponseViewModel
                {
                    Id = c.Appointment.PublicId,
                    PractitionerId = c.Appointment.PractitionerId,
                    PractitionerName = c.Appointment.Practitioner.FullName,
                    PatientName = c.Appointment.PatientRecord.Patient.User.FullName,
                    PatientId = c.Appointment.PatientRecord.Patient.PublicId,
                    Address = c.Appointment.Address == null ? new AddressViewModel() : _mapper.Map<AddressViewModel>(c.Appointment.Address),
                    StartTime = c.Appointment.StartTime,
                    EndTime = c.Appointment.EndTime,
                    Note = c.Appointment.Note,
                    AppointmentDate = c.Appointment.AppointmentDate,
                    AppointmentStatus = c.Appointment.AppointmentStatus,
                    CancelAppointmentReason = c.Appointment.CancelAppointmentReason,
                    ResourceId = c.TeamUser.Team.Name + "_" + c.Appointment.PractitionerId.ToString().ToUpper(),
                    AppointmentTypeId = c.Appointment.AppointmentType.PublicId
                }).ToList();


            var response = new List<ListAppointmentResponseViewModel>();
            if (!(result == null || resultIndividual == null))
                response = result.Concat(resultIndividual).ToList();

            return new ResponseViewModel<List<ListAppointmentResponseViewModel>>
            { Data = response.ToList(), Success = true };
        }

        public ResponseViewModel<List<AppointmentListGridViewModel>> ListAppointmentGridView(Guid currentUserId,
            AppointmentListRequestViewModel model)
        {
            var provider = GetUserProvider(currentUserId);

            Expression<Func<User, bool>> expression = c => (c.UserType == UserType.User || c.UserType == UserType.Owner)
                                                           && c.Providers.Any(p => p.Provider == provider) &&
                                                           c.IsActive;

            if (!(model.TeamId == Guid.Empty || model.TeamId == null))
            {
                Expression<Func<User, bool>> teamExpression = c => c.Teams.Any(x => x.Team.PublicId == model.TeamId);
                expression = ExpressionBuilder.AndExpression(expression, teamExpression);
            }

            if (!(model.PractitionerId == Guid.Empty || model.PractitionerId == null))
            {
                Expression<Func<User, bool>> userExpression = c => c.Id == model.PractitionerId;
                expression = ExpressionBuilder.AndExpression(expression, userExpression);
            }


            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>()
                .GetAll(expression)
                .ToList();


            var response = userRepo.Select(r => new AppointmentListGridViewModel
            {
                Id = r.Id,
                Name = r.FullName,
                Events = r.Appointments.Where(c =>
                        c.AppointmentDate.Date >= model.StartDate.Date && c.AppointmentDate.Date <= model.EndDate.Date
                                                                       && c.AppointmentStatus !=
                                                                       AppointmentStatus.Canceled)
                    .Select(e => new ListAppointmentResponseViewModel
                    {
                        Id = e.PublicId,
                        PractitionerName = e.Practitioner.FullName,
                        Address = _mapper.Map<AddressViewModel>(e.Address),
                        PatientName = e.PatientRecord.Patient.User.FullName,
                        PatientId = e.PatientRecord.Patient.PublicId,
                        PractitionerId = e.PractitionerId,
                        StartTime = e.StartTime,
                        EndTime = e.EndTime,
                        Note = e.Note,
                        AppointmentDate = e.AppointmentDate,
                        AppointmentStatus = e.AppointmentStatus,
                        CancelAppointmentReason = e.CancelAppointmentReason,
                        AppointmentTypeId = e.AppointmentType?.PublicId
                    }).ToList()
            }).ToList();


            return new ResponseViewModel<List<AppointmentListGridViewModel>> { Data = response, Success = true };
        }

        public ResponseViewModel CheckInAppointment(Guid currentUserId, AppointmentActionRequestViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.Id);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");


            if (appointmentEntity.AppointmentStatus != AppointmentStatus.Confirmed)
                throw new ArgumentException("Cannot Checkin Appointment");

            appointmentEntity.AppointmentStatus = AppointmentStatus.CheckedIn;
            appointmentEntity.CheckInTime = currentDate;
            appointmentEntity.ModifiedDate = currentDate;
            appointmentEntity.ModifiedById = currentLoginUserId;


            appointmentRepo.Update(appointmentEntity);
            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointmentEntity), Success = true };
        }

        public ResponseViewModel CheckOutAppointment(Guid currentUserId, AppointmentActionRequestViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.Id);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");


            if (appointmentEntity.AppointmentStatus != AppointmentStatus.CheckedIn)
                throw new ArgumentException("Cannot CheckOut Appointment");

            appointmentEntity.AppointmentStatus = AppointmentStatus.CheckedOut;
            appointmentEntity.CheckOutTime = currentDate;
            appointmentEntity.ModifiedDate = currentDate;
            appointmentEntity.ModifiedById = currentLoginUserId;


            appointmentRepo.Update(appointmentEntity);
            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointmentEntity), Success = true };
        }

        public ResponseViewModel SaveInternalNote(Guid currentUserId, AppointmentActionRequestViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();
            var currentLoginUserId = CustomHttpContext.GetUserLoginInfo().UserId;

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == model.Id);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");


            var noteId =
                ((ResponseViewModel<NoteViewModel>)_noteService.CreateNote(currentUserId, new NoteRequestViewModel
                {
                    PatientId = model.PatientId,
                    AppointmentId = appointmentEntity.PublicId,
                    Text = model.InternalNote,
                    Type = NoteType.Internal,
                    CareplanId = model.CareplanId,
                })).Data.Id;

            appointmentEntity.InternalNoteId = GetInternalId<Note, int>((Guid)noteId);


            appointmentEntity.ModifiedDate = currentDate;
            appointmentEntity.ModifiedById = currentLoginUserId;


            appointmentRepo.Update(appointmentEntity);
            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentViewModel>
            { Data = _mapper.Map<AppointmentViewModel>(appointmentEntity), Success = true };
        }

        public ResponseViewModel<AppointmentDetailsViewModel> GetAppointmentDetailsById(Guid currentUserId,
            Guid appointmentPublicId)
        {
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();

            var appointmentEntity = appointmentRepo.FirstOrDefault(x => x.PublicId == appointmentPublicId);
            if (appointmentEntity == null)
                throw new ArgumentException("Appointment Does not Exists");

            var result = _mapper.Map<Appointment, AppointmentDetailsViewModel>(appointmentEntity);

            //get invoice Data for appointment
            var invoice = _genericUnitOfWork.GetRepository<InvoiceItem, int>()
                .FirstOrDefault(x => x.Appointment == appointmentEntity)?.Invoice;
            if (invoice != null) result.Invoice = _mapper.Map<InvoiceListViewModel>(invoice);

            return new ResponseViewModel<AppointmentDetailsViewModel> { Data = result, Success = true };
        }

        private ResponseViewModel<List<ListAppointmentResponseViewModel>> GetAppointments(Guid currentUserId,
            Expression<Func<Appointment, bool>> expression, int take = 0)
        {
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();
            var appointmentRepo = _genericUnitOfWork.GetRepository<Appointment, int>();

            var user = userRepo.GetById(currentUserId);
            var result = appointmentRepo.GetAll(expression).OrderBy(x => x.AppointmentDate).AsQueryable();





            switch (user.UserType)
            {
                case UserType.Client:
                case UserType.ClientCustodian:
                case UserType.PrimaryCustodian:
                    break;
                case UserType.User:
                    //not required
                   // result = result.Where(c => c.PractitionerId == user.Id);
                    break;
                case UserType.Owner:
                case UserType.Manager:
                    break;
            }

            var appointments = new List<Appointment>();
            if (take > 0)
                result = result.Take(take);
            else if (take < 0) result = result.Take(take * -1);
            var response = _mapper.Map<List<Appointment>, List<ListAppointmentResponseViewModel>>(result.ToList());

            return new ResponseViewModel<List<ListAppointmentResponseViewModel>> { Data = response, Success = true };
        }

        #region Recurrence

        private List<DateTime> GetInstances(DateTime startTime, string rrule)
        {
            var dateLst = new List<DateTime>();
            if (!String.IsNullOrEmpty(rrule))
            {
                var r = new Recurrence(rrule);
                r.StartDateTime = startTime;
                dateLst = r.AllInstances().ToList();
            }

            return dateLst;
        }


        private List<Appointment> GetInstancesForUpdate(Appointment appointment) {
            var appointments = new List<Appointment>();

            if (appointment != null)
            {
                appointments.Add(appointment);
                if (!appointment.IsRecurrenceException && appointment.RecurrenceGroup != null)
                {
                    appointments = appointment.RecurrenceGroup.Appointments.Where(x => !x.IsRecurrenceException && x.StartTime >= appointment.StartTime).ToList();
                }
            }

            return appointments;
        }
        #endregion
    }
}