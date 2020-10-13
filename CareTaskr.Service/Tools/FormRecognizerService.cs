using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using Newtonsoft.Json;

namespace CareTaskr.Service.Tools
{
    internal class FormRecognizerService
    {
        public static async Task<CarePlanImportViewModel> ImportCarePlanAsync(string documentUri,
            string subscriptionKey, string modelId)
        {
            var response = await MakeRequestAsync(documentUri, subscriptionKey, modelId);
            var careplanModel = BuildCareplanModel(response);
            return careplanModel;
        }


        //TODO: add subscriptionkey and modelId/uri to appsettings
        public static async Task<string> MakeRequestAsync(string documentUri, string subscriptionKey, string modelId)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "aeee3e7fa3664e2897258dbb84a34ca1");

            var uri =
                "https://eastus.api.cognitive.microsoft.com/formrecognizer/v1.0-preview/custom/models/adfbe7e3-08cb-4619-a7ac-96a20651ee63/analyze";
            HttpResponseMessage response;

            var webClient = new WebClient();
            var byteData = webClient.DownloadData(documentUri);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                response = await client.PostAsync(uri, content);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
        }

        public static CarePlanImportViewModel BuildCareplanModel(string data)
        {
            var document = JsonConvert.DeserializeObject<Document>(data);

            var model = new CarePlanImportViewModel();

            ShortTermGoalsViewModel shortTermGoal = null;

            var keyValueLst = new List<KeyValuePair>();
            var keyValuePairs = document.Pages.Select(x => x.KeyValuePairs);
            foreach (var keyValuePair in keyValuePairs)
            foreach (var keyValue in keyValuePair)
            {
                var key = keyValue.Key.FirstOrDefault().Text.Trim();
                if (string.Compare("Name:", key, true) == 0) model.PatientName = keyValue.Value.FirstOrDefault().Text;
                if (string.Compare("NDIS number:", key, true) == 0)
                {
                    model.NDISNumber = keyValue.Value.FirstOrDefault().Text;
                }
                else if (string.Compare("My NDIS contact:", key, true) == 0)
                {
                    model.NdisContactName = keyValue.Value.FirstOrDefault().Text;
                }
                else if (string.Compare("Phone:", key, true) == 0)
                {
                    model.NdisContactPhone = keyValue.Value.FirstOrDefault().Text;
                }
                else if (string.Compare("Email:", key, true) == 0)
                {
                    model.NdisContactEmail = keyValue.Value.FirstOrDefault().Text;
                }
                else if (string.Compare("NDIS plan start date:", key, true) == 0)
                {
                    model.StartDate = DateTime.Parse(keyValue.Value.FirstOrDefault().Text);
                }
                else if (string.Compare("NDIS plan review due date:", key, true) == 0)
                {
                    model.DueDate = DateTime.Parse(keyValue.Value.FirstOrDefault().Text);
                }
                else if (string.Compare("Short-term goal", key, true) == 0 ||
                         string.Compare("Medium or long-term goal", key, true) == 0)
                {
                    //add any existing short term goals before starting to parse a new one
                    model.AddShortTermGoal(shortTermGoal);
                    shortTermGoal = new ShortTermGoalsViewModel
                    {
                        Title = keyValue.GetFlattenedValue()
                    };
                }
                else if (string.Compare("How I will achieve this goal", key, true) == 0)
                {
                    shortTermGoal.Description = keyValue.GetFlattenedValue();
                }
                else if (string.Compare("How I will be supported", key, true) == 0)
                {
                    shortTermGoal.Strategy = keyValue.GetFlattenedValue();
                }
                else if (string.Compare("Total funded supports:", key, true) == 0)
                {
                    model.FundedSupport.FirstOrDefault().FundAllocated =
                        decimal.Parse(key.Substring("Total funded supports:".Length));
                }
            }

            //Add any pending data to the model (last one found)
            model.AddShortTermGoal(shortTermGoal);


            var resultDEBUG = JsonConvert.SerializeObject(model);
            return model;
        }
    }


    public class CarePlanImportViewModel
    {
        public string PatientName { get; set; }
        public string NdisContactName { get; set; }
        public string NdisContactPhone { get; set; }
        public string NdisContactEmail { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public List<FamilyGoalsViewModel> FamilyGoals { get; set; } = new List<FamilyGoalsViewModel>();
        public List<FundedSupportViewModel> FundedSupport { get; set; } = new List<FundedSupportViewModel>();
        public string NDISNumber { get; set; }

        public void AddShortTermGoal(ShortTermGoalsViewModel shortTermGoal)
        {
            if (shortTermGoal == null) return;

            if (FamilyGoals.Count == 0) FamilyGoals.Add(new FamilyGoalsViewModel());

            FamilyGoals.FirstOrDefault().ShortTermGoals.Add(shortTermGoal);
        }
    }
}