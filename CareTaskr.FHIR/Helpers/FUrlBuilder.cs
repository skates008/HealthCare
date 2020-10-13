using System;
using System.Text;
using Hl7.Fhir.Model;

namespace CareTaskr.FHIR.Helpers
{
    public static class FUrlBuilder
    {
        public static string ResourceUri(ResourceType resourceType, string technicalId, int? versionId = 0)
        {
            var uri = new StringBuilder();
            if (!string.IsNullOrWhiteSpace(resourceType.ToString()))
            {
                uri.AppendJoin("/", technicalId);
                if (versionId.HasValue && versionId > 0)
                {
                    uri.AppendJoin("/", "_history");
                    uri.AppendJoin("/", technicalId);
                }
            }

            return uri.ToString();
        }

        public static string SearchByIndentifier(Guid id)
        {
            var str = new StringBuilder();
            if (id != null) str.Append("identifier:value=").Append(id);
            return str.ToString();
        }
    }
}