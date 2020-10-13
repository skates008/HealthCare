using CareTaskr.Domain.Base;

namespace CareTaskr.Domain.Entities
{
    public class Address
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string StreetName { get; set; }
        public string StreetNumber { get; set; }
        public string Unit { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Observations { get; set; }
        public string AddressType { get; set; }
        public bool IsActive { get; set; } = true;
        public override string ToString()
        {
            return $"{Unit}, {StreetName}, {StreetNumber}|{City}|{PostalCode}, {State} ";
        }
    }
}
