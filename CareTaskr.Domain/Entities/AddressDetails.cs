using Microsoft.EntityFrameworkCore;

namespace CareTaskr.Domain.Entities
{
    [Owned]
    public class AddressDetails
    {
        public string Address { get; set; }
        public string State { get; set; }
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string Unit { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
    }
}
