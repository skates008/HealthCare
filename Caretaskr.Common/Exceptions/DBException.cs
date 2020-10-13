using System;

namespace Caretaskr.Common.Exceptions
{
    public class DBException : Exception
    {
        public DBException()
            : base("Error Occured while Saving")
        {
        }
    }
}