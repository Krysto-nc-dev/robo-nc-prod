// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { RECORDS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const recordsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all records
    getRecords: builder.query({
      query: () => ({
        url: `${RECORDS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Record'],
      keepUnusedDataFor: 5,
    }),

    // Create a new record
    createRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Record'],
    }),

    // Get a record by ID
    getRecordById: builder.query({
      query: (recordId) => ({
        url: `${RECORDS_URL}/${recordId}`,
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    // Update a record
    updateRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/${data.recordId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Record'],
    }),

    // Delete a record
    deleteRecord: builder.mutation({
      query: (recordId) => ({
        url: `${RECORDS_URL}/${recordId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Record'],
    }),

    // Update a record by scanning a barcode
    updateRecordByBarcode: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/scan`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Record'],
    }),

    // Get records by zone ID
    getRecordsByZone: builder.query({
      query: (zoneId) => ({
        url: `${RECORDS_URL}/zone/${zoneId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Record'],
      keepUnusedDataFor: 5,
    }),
  }),
});

// Export the generated hooks
export const {
  useGetRecordsQuery,
  useCreateRecordMutation,
  useGetRecordByIdQuery,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
  useUpdateRecordByBarcodeMutation,
  useGetRecordsByZoneQuery,
} = recordsApiSlice;
