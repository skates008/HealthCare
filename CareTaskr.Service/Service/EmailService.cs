using System;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using CareTaskr.Service.Interface;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace CareTaskr.Service.Service
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _emailConfiguration;
        private readonly CareTaskrUrl _careTaskrUrls;

        public EmailService(IOptions<EmailConfiguration> emailConfiguration,
            IOptions<CareTaskrUrl> careTaskrUrls)
        {
            _emailConfiguration = emailConfiguration.Value;
            _careTaskrUrls = careTaskrUrls.Value;
        }


        public async Task SendEmailAsync(string email, string subject, string message)
        {
            try
            {
                var client = new SendGridClient(_emailConfiguration.ApiKey);
                var from = new EmailAddress(_emailConfiguration.FromEmail, _emailConfiguration.FromName);

                var to = new EmailAddress(email, "");
                var plainTextContent = "";

                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, message);

                var response = await client.SendEmailAsync(msg);
            }

            catch (Exception ex)
            {
            }
        }
        public async Task SendEmailDynamicTemplate(string toEmail, string templateId, object data)
        {
            try
            {
                var client = new SendGridClient(_emailConfiguration.ApiKey);
                var from = new EmailAddress(_emailConfiguration.FromEmail, _emailConfiguration.FromName);
                var to = new EmailAddress(toEmail, "recipient");
                var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, data);

                var response = await client.SendEmailAsync(msg);
                //todo log response 

            }

            catch (Exception ex)
            {
            }
        }




    }
}