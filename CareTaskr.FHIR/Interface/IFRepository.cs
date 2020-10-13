using System;
using System.Collections.Generic;
using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

namespace CareTaskr.Service.Interface
{
    public interface IFRepository
    {
        TResource Create<TResource>(TResource resource) where TResource : Resource;
        TResource Update<TResource>(TResource resource) where TResource : Resource;
        bool Delete(string location);

        List<Resource> SearchByIdentifier(ResourceType resourceType, List<Guid> identifierLst);
        Resource SearchByIdentifier(ResourceType resourceType, Guid identifier);

        public Bundle Search(SearchParams q, ResourceType resourceType);

        public Resource Get(Uri url);
    }
}