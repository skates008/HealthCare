using System;
using System.Collections;
using System.Collections.Generic;

namespace Caretaskr.Common.ViewModel.General
{
    public class DataSourceResult
    {
        public object Aggregates { get; set; }
        public IEnumerable Data { get; set; }
        public int Total { get; set; }
    }

    public class DataResult<T> where T : class
    {
        private List<CarePlanListViewModel> r;


        public DataResult(ICollection<T> data)
        {
            Data = data;
            Total = data.Count;
        }

        public object Aggregates { get; set; }
        public ICollection<T> Data { get; set; }
        public int Total { get; set; }
    }


    public class DataRequestModel
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public IEnumerable<Sort> Sort { get; set; }
        public IList<DataExtension> DataExtensions { get; set; }
        public Dictionary<string, string> Filter { get; set; }
    }

    public class DataSourceResult<T> where T : class
    {
        public object Aggregates { get; set; }
        public ICollection<T> Data { get; set; }
        public int Total { get; set; }
    }

    public class Sort
    {
        public string Field { get; set; }
        public SortOrder Direction { get; set; }
    }

    public enum SortOrder
    {
        ASCENDING,
        DESCENDING
    }

    public class DataExtension
    {
        public string Field { get; set; }
        public Type FieldType { get; set; }
        public string ActualField { get; set; }
        public string CustomType { get; set; }
        public object Columns { get; set; }
        public bool Ignore { get; set; }
    }
}