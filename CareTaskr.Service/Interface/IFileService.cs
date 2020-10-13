using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace CareTaskr.Service.Interface
{
    public interface IFileService
    {
        Task<ResponseViewModel> UploadUserDocument(Guid currentUserId, UserUploadDocumentViewModel model);


        Task<ResponseViewModel> UploadProviderDocument(Guid currentUserId, ProviderUploadDocumentViewModel model);

        string UploadFileToBlob(Guid currentUserId, string fileName, string mimeType, byte[] file);

        string GetContainerSasUri(string blobName);

        PatientRecordFile Upload(Guid currentUserId, PatientRecord patientRecord,
            FileUploadRequestViewModel fileToUpload, PatientRecordFileType type);

        List<PatientRecordFile> Upload(Guid currentUserId, PatientRecord patientRecord,
            List<FileUploadRequestViewModel> filesToUpload, PatientRecordFileType type);

        bool DeleteFile(Guid currentUserId, Guid fileId);
        Task<FileUpload> GetFileAsync(Guid guid, Guid fileId);

        DataSourceResult ListFiles(Guid currentUserId, DataRequestModel dataRequest);
    }
}