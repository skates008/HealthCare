using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace CareTaskr.Domain.Enum
{
    public class DefaultData
    {
        public static Hashtable AppointmentTypes = new Hashtable()
         {
            //name, isbillable?
             { "Standard Appointment",true},
             { "General Appointment",false}
    };
    }
}
