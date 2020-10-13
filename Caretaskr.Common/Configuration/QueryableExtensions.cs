using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using AutoMapper;
using Caretaskr.Common.ViewModel.General;

namespace Caretaskr.Common.Configuration
{
    public static class QueryableExtensions
    {
        public static ICollection<T> ToCollectionResult<T>(this IQueryable<T> queryable, DataRequestModel dataRequest,
            Sort initialsort) where T : class
        {
            // Filter the data first


            // Calculate the total number of records (needed for paging)
            var total = queryable.Count();

            // Sort the data
            queryable = Sort(queryable, initialsort);

            // Finally page the data
            queryable = Page(queryable, dataRequest.PageSize, dataRequest.PageNumber);

            return queryable.ToList();
        }


        public static DataSourceResult ToDataSourceResult<T>(this IQueryable<T> queryable, DataRequestModel dataRequest,
            Sort initialsort)
        {
            // Filter the data first


            // Calculate the total number of records (needed for paging)
            var total = queryable.Count();

            // Sort the data
            queryable = Sort(queryable, initialsort);

            // Finally page the data
            queryable = Page(queryable, dataRequest.PageSize, dataRequest.PageNumber);

            return new DataSourceResult
            {
                Data = queryable.ToList(),
                Total = total
            };
        }


        public static DataSourceResult ToDataSourceResult<T, TD>(this IQueryable<T> queryable, IMapper mapper,
            DataRequestModel dataRequest, Sort initialsort)
        {
            // Calculate the total number of records (needed for paging)
            var total = queryable.Count();

            // Sort the data
            queryable = Sort(queryable, initialsort);

            // Finally page the data
            queryable = Page(queryable, dataRequest.PageSize, dataRequest.PageNumber);
            var mapped = mapper.Map<IList<T>, IList<TD>>(queryable.ToList());
            return new DataSourceResult
            {
                Data = mapped.ToList(),
                Total = total
            };
        }

        public static DataSourceResult ToDataSourceResult<T, TD>(this IQueryable<T> queryable, IMapper mapper)
        {
            var mapped = mapper.Map<IList<T>, IList<TD>>(queryable.ToList());
            return new DataSourceResult
            {
                Data = mapped,
                Total = mapped.Count()
            };
        }


        private static IQueryable<T> Sort<T>(IQueryable<T> queryable, Sort initialsort)
        {
            if (string.IsNullOrEmpty(initialsort.Field)) return queryable;


            var order = initialsort.Direction == SortOrder.ASCENDING ? " ascending" : " descending";

            // Use the OrderBy method of Dynamic Linq to sort the data
            return queryable.OrderBy(initialsort.Field + order);
        }

        private static IQueryable<T> Page<T>(IQueryable<T> queryable, int pageSize, int pageNumber)
        {
            int skip = pageNumber < 1 ? 0 : (pageNumber * pageSize);
            return pageSize == 0 ? queryable : queryable.Skip(skip)
                                 .Take(pageSize);
        }
    }
}