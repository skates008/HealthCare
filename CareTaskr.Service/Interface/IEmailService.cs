using System.Threading.Tasks;

namespace CareTaskr.Service.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message);
        Task SendEmailDynamicTemplate(string toEmail, string templateId, dynamic data);
    }
}