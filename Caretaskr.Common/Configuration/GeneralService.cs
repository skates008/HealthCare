using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using Caretaskr.Common.ViewModel.General;

namespace Caretaskr.Common.Configuration
{
    public static class GeneralService
    {
        public static DateTime CurrentDate => DateTime.Now;

        public static double? DiffInMinutes(DateTime? start, DateTime? end)
        {
            if (start == null || end == null)
                return default(double);
            return (end - start)?.TotalMinutes;
        }

        public static string GetExtension(string ext, string contenttype)
        {
            switch (ext.ToLower())
            {
                case ".jpg":
                    contenttype = "image/jpg";
                    break;

                case ".jpeg":
                    contenttype = "image/jpg";
                    break;

                case ".jpe":
                    contenttype = "image/jpg";
                    break;

                case ".png":
                    contenttype = "image/png";
                    break;
            }

            return contenttype;
        }

        public static class EnumList<T>
        {
            public static IEnumerable<ListViewModel> Get()
            {
                var names = GetDescriptions(typeof(T));
                var values = Enum.GetValues(typeof(T)).Cast<int>();

                return names.Zip(values, (name, value) => new ListViewModel {Text = name, Id = value}).ToList();
            }

            private static IEnumerable<string> GetDescriptions(Type type)
            {
                var names = Enum.GetNames(type);
                return (from name in names
                    let field = type.GetField(name)
                    let fds = field.GetCustomAttributes(typeof(DescriptionAttribute), true)
                    select fds.Any() ? ((DescriptionAttribute) fds[0]).Description : name).ToList();
            }
        }
    }
}