// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { REPPORTGENERATORS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const repportGeneratorsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all report generators
    getRepportGenerators: builder.query({
      query: () => ({
        url: `${REPPORTGENERATORS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['RepportGenerator'],
      keepUnusedDataFor: 5,
    }),

    // Create a new report generator
    createRepportGenerator: builder.mutation({
      query: (data) => ({
        url: `${REPPORTGENERATORS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['RepportGenerator'],
    }),

    // Get a report generator by ID
    getRepportGeneratorById: builder.query({
      query: (id) => ({
        url: `${REPPORTGENERATORS_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, id) => [{ type: 'RepportGenerator', id }],
      keepUnusedDataFor: 5,
    }),

    // Update a report generator
    updateRepportGenerator: builder.mutation({
      query: (data) => ({
        url: `${REPPORTGENERATORS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['RepportGenerator'],
    }),

    // Delete a report generator
    deleteRepportGenerator: builder.mutation({
      query: (id) => ({
        url: `${REPPORTGENERATORS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['RepportGenerator'],
    }),

    // Upload a document to a report generator
    uploadDocumentToReportGenerator: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${REPPORTGENERATORS_URL}/${id}/upload-document`,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'RepportGenerator', id }],
    }),

    // Generate PDF for a report generator
    generatePDFReport: builder.query({
      query: (id) => ({
        url: `${REPPORTGENERATORS_URL}/${id}/generate-pdf`,
        method: 'GET',
        credentials: 'include',
        responseHandler: (response) => response.blob(), // Pour télécharger un PDF
      }),
      providesTags: (result, error, id) => [{ type: 'RepportGenerator', id }],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetRepportGeneratorsQuery,
  useCreateRepportGeneratorMutation,
  useGetRepportGeneratorByIdQuery,
  useUpdateRepportGeneratorMutation,
  useDeleteRepportGeneratorMutation,
  useUploadDocumentToReportGeneratorMutation,
  useGeneratePDFReportQuery,
} = repportGeneratorsApiSlice;
