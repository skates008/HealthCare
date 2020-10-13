using System;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;

namespace CareTaskr.Service.Interface
{
    public interface INoteService
    {
        #region Notes

        ResponseViewModel CreateNote(Guid currentUserId, NoteRequestViewModel model);
        ResponseViewModel UpdateNote(Guid currentUserId, Guid publicId, NoteRequestViewModel model);
        ResponseViewModel GetNote(Guid currentUserId, Guid noteId);

        DataSourceResult ListNotes(Guid currentUserId, DataRequestModel dataRequest);
        ResponseViewModel DeleteNote(Guid currentUserId, Guid noteId);

        #endregion
    }
}