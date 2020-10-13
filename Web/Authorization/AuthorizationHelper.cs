using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CareTaskr.Authorization
{
    public class AuthorizationHelper
    {

        public static void SetAuthorizationOptions(ref AuthorizationOptions options) {

            foreach (DictionaryEntry entry in UserAction.Permissions)
            {
                string[] roles = (string[]) entry.Value;
                options.AddPolicy((string)entry.Key, policy => policy.RequireRole(roles));
            }
    }
    }


}
