using AutoMapper;

namespace Caretaskr.Common.ViewModel
{
    public class InitRegistrationtViewModel
    {
        public string FullName { get; set; }

        //toremove
        public string FirstName { get; set; }
        public string LastName { get; set; }


        public string CarerFirstName { get; set; }
        public string CarerLastName { get; set; }
        public string CarerEmail { get; set; }
        public string CarerContact { get; set; }
        public string CarerRelation { get; set; }
        public bool HasCarer { get; set; }
    }


    public class InitialRegistrationMapper : Profile
    {
    }
}