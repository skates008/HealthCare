using System;
using System.Collections.Generic;

namespace Caretaskr.Common.ViewModel
{
    public class AppointmentNotificationViewModel: EmailNotificationViewModel
    {
        public string ParticipantName { get; set; }
        public string PractitionerName { get; set; }
        public string StartTime { get; set; }

        public string EndTime { get; set; } 
        public string AppointmentDate { get; set; }

        public AddressViewModel Address { get; set; } = new AddressViewModel();

    }


    public class AppointmentUpdateNotificationViewModel: AppointmentNotificationViewModel
    {
         
        public string PrevAppointmentDate { get; set; }
 

    }


}