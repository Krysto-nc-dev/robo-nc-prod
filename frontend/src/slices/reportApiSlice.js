// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { REPPORTS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const repportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reports
    getReports: builder.query({
      query: () => ({
        url: `${REPPORTS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Repport'],
      keepUnusedDataFor: 5,
    }),

    // Create a new report
    createReport: builder.mutation({
      query: (data) => ({
        url: `${REPPORTS_URL}`,
        method: 'POST',
        body: {
          nom: data.nom,
          description: data.description,
          note: data.note,
          status: data.status,
          type: data.type,
          category: data.category, // Ajout de category
          tickets: data.tickets,
          documents: data.documents,
          maintainedBy: data.maintainedBy,
          frequence: data.frequence, // Ajout de frequence
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Repport'],
    }),

    // Get a report by ID
    getReportById: builder.query({
      query: (id) => ({
        url: `${REPPORTS_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, id) => [{ type: 'Repport', id }],
      keepUnusedDataFor: 5,
    }),

    // Update a report
    updateReport: builder.mutation({
      query: (data) => ({
        url: `${REPPORTS_URL}/${data.id}`,
        method: 'PUT',
        body: {
          nom: data.nom,
          description: data.description,
          note: data.note,
          status: data.status,
          type: data.type,
          category: data.category, // Ajout de category
          tickets: data.tickets,
          documents: data.documents,
          maintainedBy: data.maintainedBy,
          frequence: data.frequence, // Ajout de frequence
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Repport'],
    }),

    // Delete a report
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `${REPPORTS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Repport'],
    }),

    // Add a document to a report
    addDocumentToReport: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${REPPORTS_URL}/${id}/add-document`,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Repport', id }],
    }),

    // Generate PDF for a report
    generatePDFReport: builder.query({
      query: (id) => ({
        url: `${REPPORTS_URL}/${id}/generate-pdf`,
        method: 'GET',
        credentials: 'include',
        responseHandler: (response) => response.blob(), // Pour télécharger un PDF
      }),
      providesTags: (result, error, id) => [{ type: 'Repport', id }],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useGetReportByIdQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useAddDocumentToReportMutation,
  useGeneratePDFReportQuery,
} = repportApiSlice;
