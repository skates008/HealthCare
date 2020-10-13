using System;
using System.Linq;
using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

namespace CareTaskr.FHIR.Helpers
{
    internal static class FHelper
    {
        public static Resource SearchByIdentifier(FhirClient fhirClient, ResourceType resourceType, Guid identifier)
        {
            if (identifier == Guid.Empty) return null;
            //var bundle = fhirClient.Search<Patient>(new string[] { UrlBuilder.SearchByIndentifier(id) });

            var p = new SearchParams();
            p.Add("identifier:value", identifier.ToString());
            var bundle = fhirClient.Search(p, resourceType.ToString());
            if (bundle.Total == 1)
                return bundle.GetResources().First();
            throw new Exception("No resource found for resource with identifier: " + identifier);
        }

        public static string GetResourceUri(ResourceType resourceType, Guid identifier)
        {
            var resource = SearchByIdentifier(null, resourceType, identifier);
            return resource != null ? resource.ResourceIdentity().WithoutVersion().ToString() : string.Empty;
        }
    }
}