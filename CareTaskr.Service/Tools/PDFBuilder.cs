using DinkToPdf;
using DinkToPdf.Contracts;

namespace CareTaskr.Service.Reporting
{
    internal class PDFBuilder
    {
        public static byte[] ConvertHtmltoPdf(IConverter converter, string html, bool displayPagination = false)
        {
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings {Top = 10},
                DocumentTitle = "Invoice"
                //Out = @"D:\PDFCreator\Employee_Report.pdf"
            };


            var objectSettings = new ObjectSettings
            {
                HtmlContent = html,
                WebSettings = {DefaultEncoding = "utf-8"}
                //HeaderSettings = { FontName = "Arial", FontSize = 9},
                //FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Right = "Page [page] of [toPage]" }
            };
            if (displayPagination)
            {
                objectSettings.PagesCount = true;
                objectSettings.FooterSettings = new FooterSettings
                    {FontName = "Verdana", FontSize = 8, Line = true, Right = "Page [page] of [toPage]"};
            }

            var pdf = new HtmlToPdfDocument
            {
                GlobalSettings = globalSettings,
                Objects = {objectSettings}
            };


            return converter.Convert(pdf);
        }
    }
}