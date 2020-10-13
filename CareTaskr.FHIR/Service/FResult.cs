using System;
using System.Collections;
using System.Collections.Generic;

namespace CareTaskr.Service
{
    public class FResult<K, T>
    {
        public DataSummary DataSummary = new DataSummary();

        public FResult(bool success)
        {
            Success = success;
        }

        public FResult(bool success, K id, T data)
        {
            Success = success;
            Data = AddData(id, data);
            DataSummary.TotalResults = 1;
            DataSummary.IndexTo = 1;
        }

        public FResult(bool success, List<T> data)
        {
            Success = success;
            Data = data;
            DataSummary.TotalResults = data.Count;
            DataSummary.IndexTo = data.Count;
        }

        public bool Success { get; set; }
        public List<string> ErrorMessages { get; set; } = new List<string>();

        public List<T> Data { set; get; } = new List<T>();
        public Hashtable DataHash { get; set; } = new Hashtable();

        public DataSummary GetDataSummary()
        {
            //if data summary was not properly set, do it here!
            if (DataSummary.TotalResults == 0 && Data.Count > 0)
            {
                DataSummary.TotalResults = Data.Count;
                DataSummary.IndexTo = DataSummary.TotalResults;
            }

            return DataSummary;
        }


        public bool HasData()
        {
            return Data.Count > 0;
        }

        public T DataFirstItem()
        {
            return Data[0];
        }

        public List<T> AddData(T data)
        {
            Data.Add(data);
            return Data;
        }

        public List<T> AddData(K key, T data)
        {
            Data.Add(data);
            DataHash.Add(key, data);
            return Data;
        }

        public T Get(Guid id)
        {
            return (T) DataHash[id];
        }

        public List<string> addErrorMessage(string errorMessage)
        {
            ErrorMessages.Add(errorMessage);
            return ErrorMessages;
        }
    }

    public class DataSummary
    {
        public int TotalResults { get; set; }
        public int IndexFrom { get; set; } = 0;
        public int IndexTo { get; set; }

        public bool HasMoreData()
        {
            return IndexTo != TotalResults;
        }
    }
}