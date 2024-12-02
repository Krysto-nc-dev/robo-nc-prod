// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { MASTER_REPPORTS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const masterRepportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all MasterRepports
    getMasterRepports: builder.query({
      query: () => ({
        url: `${MASTER_REPPORTS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['MasterRepport'],
      keepUnusedDataFor: 5,
    }),

    // Create a new MasterRepport
    createMasterRepport: builder.mutation({
      query: (data) => ({
        url: `${MASTER_REPPORTS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['MasterRepport'],
    }),

    // Get a MasterRepport by ID
    getMasterRepportById: builder.query({
      query: (masterRepportId) => ({
        url: `${MASTER_REPPORTS_URL}/${masterRepportId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, masterRepportId) => [{ type: 'MasterRepport', id: masterRepportId }],
      keepUnusedDataFor: 5,
    }),

    // Update a MasterRepport
    updateMasterRepport: builder.mutation({
      query: (data) => ({
        url: `${MASTER_REPPORTS_URL}/${data.masterRepportId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['MasterRepport'],
    }),

    // Delete a MasterRepport
    deleteMasterRepport: builder.mutation({
      query: (masterRepportId) => ({
        url: `${MASTER_REPPORTS_URL}/${masterRepportId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['MasterRepport'],
    }),

    // Add a document to a MasterRepport
    addDocumentToMasterRepport: builder.mutation({
      query: ({ masterRepportId, document }) => ({
        url: `${MASTER_REPPORTS_URL}/${masterRepportId}/documents`,
        method: 'POST',
        body: document,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { masterRepportId }) => [{ type: 'MasterRepport', id: masterRepportId }],
    }),

    // Delete a document from a MasterRepport
    deleteDocumentFromMasterRepport: builder.mutation({
      query: ({ masterRepportId, documentId }) => ({
        url: `${MASTER_REPPORTS_URL}/${masterRepportId}/documents/${documentId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { masterRepportId }) => [{ type: 'MasterRepport', id: masterRepportId }],
    }),
  }),
});

// Export the generated hooks
export const {
  useAddDocumentToMasterRepportMutation,
  useDeleteDocumentFromMasterRepportMutation,
  useCreateMasterRepportMutation,
  useDeleteMasterRepportMutation,
  useGetMasterRepportByIdQuery,
  useGetMasterRepportsQuery,
  useUpdateMasterRepportMutation,
} = masterRepportsApiSlice;
