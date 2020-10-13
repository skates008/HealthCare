using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CareTaskr.Service.Interface;
using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

namespace CareTaskr.FHIR.Data
{
    public class FhirRepository : IFRepository
    {
        private readonly FhirClient _fhirClient;

        public FhirRepository(string fhirServerBaseUrl)
        {
            // Configure FhirClient
            //http://docs.simplifier.net/fhirnetapi/client/setup.html

            _fhirClient = new FhirClient(fhirServerBaseUrl)
            {
                PreferredFormat = ResourceFormat.Json,
                Timeout = 120000
            };
        }

        public TResource Create<TResource>(TResource resource) where TResource : Resource
        {
            return _fhirClient.Create(resource);
        }

        public TResource Update<TResource>(TResource resource) where TResource : Resource
        {
            //Update with version aware enabled.
            return _fhirClient.Update(resource);
        }


        public bool Delete(string location)
        {
            _fhirClient.Delete(location);
            return true;
        }


        public List<Resource> SearchByIdentifier(ResourceType resourceType, List<Guid> identifierLst)
        {
            if (identifierLst == null || identifierLst.Count == 0) return new List<Resource>();
            var p = new SearchParams();
            var ids = new StringBuilder();
            ids.AppendJoin(",", identifierLst);

            p.Add("identifier", ids.ToString());

            var bundle = _fhirClient.Search(p, resourceType.ToString());

            return bundle.GetResources().ToList();
        }


        public Resource SearchByIdentifier(ResourceType resourceType, Guid identifier)
        {
            if (identifier == null) return null;
            var resources = SearchByIdentifier(resourceType, new List<Guid> {identifier});

            return resources.Count == 1 ? resources.First() : null;
        }


        public Bundle Search(SearchParams q, ResourceType resourceType)
        {
            return _fhirClient.Search(q, resourceType.ToString());
        }

        public Resource Get(Uri url)
        {
            return _fhirClient.Get(url);
        }
    }
}