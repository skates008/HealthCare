using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;

namespace CareTaskr.Service.Reporting
{
    public class CsvFile<T>
    {
        public CsvFile(List<T> data, string filename)
        {
            Filename = filename;
            FileContents = ConvertToCsv(data);
        }

        public byte[] FileContents { get; set; }
        public string Filename { get; set; }

        private byte[] ConvertToCsv(List<T> data)
        {
            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream, Encoding.UTF8, 1024, true);
            var csvWriter = new CsvWriter(writer, CultureInfo.InvariantCulture);


            csvWriter.Configuration.Delimiter = ",";
            csvWriter.Configuration.HasHeaderRecord = true;
            csvWriter.Configuration.AutoMap<T>();

            csvWriter.WriteHeader<T>();
            csvWriter.NextRecord();
            csvWriter.WriteRecords(data);

            writer.Flush();
            return memoryStream.ToArray();
        }
    }
}