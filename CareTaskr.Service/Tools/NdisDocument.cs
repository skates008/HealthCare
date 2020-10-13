using System.Text;
using Newtonsoft.Json;

namespace CareTaskr.Service.Tools
{
    public class Document
    {
        [JsonProperty("status")] public string Status { get; set; }

        [JsonProperty("pages")] public Page[] Pages { get; set; }

        [JsonProperty("errors")] public object[] Errors { get; set; }
    }

    public class Page
    {
        [JsonProperty("number")] public long Number { get; set; }

        [JsonProperty("height")] public long Height { get; set; }

        [JsonProperty("width")] public long Width { get; set; }

        [JsonProperty("clusterId")] public long? ClusterId { get; set; }

        [JsonProperty("keyValuePairs")] public KeyValuePair[] KeyValuePairs { get; set; }

        [JsonProperty("tables")] public object[] Tables { get; set; }
    }

    public class KeyValuePair
    {
        [JsonProperty("key")] public Key[] Key { get; set; }

        [JsonProperty("value")] public Value[] Value { get; set; }

        public string GetFlattenedValue()
        {
            var strBuilder = new StringBuilder();
            foreach (var value in Value) strBuilder.Append($" {value.Text}");
            return strBuilder.ToString().Trim();
        }
    }

    public class Key
    {
        [JsonProperty("text")] public string Text { get; set; }

        [JsonProperty("boundingBox")] public double[] BoundingBox { get; set; }
    }

    public class Value
    {
        [JsonProperty("text")] public string Text { get; set; }

        [JsonProperty("boundingBox")] public double[] BoundingBox { get; set; }

        [JsonProperty("confidence")] public double Confidence { get; set; }
    }
}