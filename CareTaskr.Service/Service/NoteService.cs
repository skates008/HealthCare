using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Helpers;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;

namespace CareTaskr.Service.Service
{
    public class NoteService : ParentService, INoteService
    {
        private readonly IFileService _fileService;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;

        public NoteService(IGenericUnitOfWork genericUnitOfWork,
            IFileService uploadService,
            IMapper mapper) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _fileService = uploadService;
            _mapper = mapper;
        }


        #region Notes

        public ResponseViewModel CreateNote(Guid currentUserId, NoteRequestViewModel model)
        {
            var note = CreateUpdateNote(currentUserId, model, Guid.Empty);
            return new ResponseViewModel<NoteViewModel> {Data = _mapper.Map<NoteViewModel>(note), Success = true};
        }

        public ResponseViewModel UpdateNote(Guid currentUserId, Guid noteId, NoteRequestViewModel model)
        {
            var note = CreateUpdateNote(currentUserId, model, noteId);
            return new ResponseViewModel<NoteViewModel> {Data = _mapper.Map<NoteViewModel>(note), Success = true};
        }


        private Note CreateUpdateNote(Guid currentUserId, NoteRequestViewModel model, Guid noteId)
        {
            Note note;
            if (noteId != Guid.Empty)
            {
                //UPDATE
                note = GetEntity<Note, int>(noteId);
                note.ModifiedById = currentUserId;
                note.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                note = new Note
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId
                };
            }

            note.Type = model.Type;
            note.Title = model.Title;
            note.Text = model.Text;
            note.PatientRecord = GetPatientRecord(currentUserId, model.PatientId);
            if (model.AppointmentId != null && model.AppointmentId != Guid.Empty)
                note.Appointment = GetEntity<Appointment, int>((Guid) model.AppointmentId);
            if (model.CareplanId != null && model.CareplanId != Guid.Empty)
                note.Careplan = GetEntity<Careplan, int>((Guid) model.CareplanId);


            if (model.FilesToUpload != null)
            {
                if (note.Files == null)
                    note.Files = new List<PatientRecordFile>();

                var filesUploaded = _fileService.Upload(currentUserId, note.PatientRecord, model.FilesToUpload,
                    PatientRecordFileType.Note);
                note.Files = note.Files.Concat(filesUploaded).ToList();
            }

            if (noteId == Guid.Empty)
                AddEntity<Note, int>(note);
            else
                UpdateEntity<Note, int>(note);

            return note;
        }

        public ResponseViewModel GetNote(Guid currentUserId, Guid noteId)
        {
            var note = GetEntity<Note, int>(noteId);
            return new ResponseViewModel<NoteViewModel> {Data = _mapper.Map<NoteViewModel>(note), Success = true};
        }


        public DataSourceResult ListNotes(Guid currentUserId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<Note, Guid>().GetAll().AsQueryable();

            if (dataRequest.Filter != null)
            {
                if (dataRequest.Filter.ContainsKey(Constants.QueryFilters.TYPE))
                {
                    var type = (NoteType) Enum.Parse(typeof(NoteType), dataRequest.Filter[Constants.QueryFilters.TYPE],
                        true);
                    queryable = queryable.Where(p => p.Type == type);
                }

                if (dataRequest.Filter.ContainsKey(Constants.QueryFilters.CAREPLAN_ID))
                {
                    //return all notes linked to a careplan or its appointments
                    var careplanPublicId = new Guid(dataRequest.Filter[Constants.QueryFilters.CAREPLAN_ID]);
                    var appointmentIds = _genericUnitOfWork.GetRepository<TimeEntry, int>().GetAll()
                        .Where(x => x.Careplan.PublicId == careplanPublicId && x.Appointment != null)
                        .Select(x => x.AppointmentId).Distinct().ToList();
                    queryable = queryable.Where(p =>
                        p.Careplan.PublicId == careplanPublicId || appointmentIds.Contains(p.AppointmentId));
                }

                if (dataRequest.Filter.ContainsKey(Constants.QueryFilters.APPOINTMENT_ID))
                    queryable = queryable.Where(p =>
                        p.Appointment.PublicId == new Guid(dataRequest.Filter[Constants.QueryFilters.APPOINTMENT_ID]));
                if (dataRequest.Filter.ContainsKey(Constants.QueryFilters.PATIENT_ID))
                {
                    var patientRecordPublicId = GetPatientRecord(currentUserId,
                        new Guid(dataRequest.Filter[Constants.QueryFilters.PATIENT_ID])).PublicId;
                    queryable = queryable.Where(p => p.PatientRecord.PublicId == patientRecordPublicId);
                }
            }

            var result = queryable.ToDataSourceResult<Note, NoteViewModel>(_mapper, dataRequest,
                new Sort {Field = "", Direction = SortOrder.ASCENDING});

            return result;
        }

        public ResponseViewModel DeleteNote(Guid currentUserId, Guid noteId)
        {
            DeleteEntity<Note, int>(currentUserId, noteId);
            return new ResponseViewModel<NoteViewModel> {Success = true};
        }

        #endregion
    }
}