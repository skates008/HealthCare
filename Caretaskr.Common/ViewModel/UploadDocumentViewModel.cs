using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class UploadDocumentViewModel
    {
        public string FileName { get; set; }
        public string ThumbnailImageName { get; set; }
        public string MimeType { get; set; }
        public string Path { get; set; }
        public string ThumbnailPath { get; set; }
    }


    public class UserUploadDocumentViewModel : UploadDocumentViewModel
    {
        public UserDocumentType DocumentType { get; set; }
    }

    public class ProviderUploadDocumentViewModel : UploadDocumentViewModel
    {
        public ProviderDocumentType DocumentType { get; set; }
    }


    public class UploadResultViewModel
    {
        public string Name { get; set; }
        public string Extension { get; set; }
        public string Path { get; set; }
        public string ThumbnailPath { get; set; }
        public string ThumbnailImageName { get; set; }
    }
}