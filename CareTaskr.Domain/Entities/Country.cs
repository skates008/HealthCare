namespace CareTaskr.Domain.Entities
{
    public class Country  
    {
        public int Id { get; set; }
        public string CountryCode { get; set; }

        public string CountryName { get; set; }

        public bool IsActive { get; set; }


    }
}
