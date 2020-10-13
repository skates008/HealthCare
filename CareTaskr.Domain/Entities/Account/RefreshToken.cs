using System;

namespace CareTaskr.Domain.Entities.Account
{
    public class RefreshToken
    {
        public string Id { get; set; }

        public DateTime IssuedUtc { get; set; }
        public DateTime ExpiresUtc { get; set; }
        public string Token { get; set; }
      
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
    }
     
}
