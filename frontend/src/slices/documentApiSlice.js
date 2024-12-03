// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { DOCUMENTS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all documents
    getDocuments: builder.query({
      query: () => ({
        url: `${DOCUMENTS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Document'],
      keepUnusedDataFor: 5,
    }),

    // Get a document by ID
    getDocumentById: builder.query({
      query: (documentId) => ({
        url: `${DOCUMENTS_URL}/${documentId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, documentId) => [{ type: 'Document', id: documentId }],
      keepUnusedDataFor: 5,
    }),

    // Upload a document to a specific resource (e.g., generator)
    uploadDocument: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${DOCUMENTS_URL}/${id}/upload`,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Document'],
    }),

    // Create a new document (without file upload)
    createDocument: builder.mutation({
      query: (formData) => ({
        url: `${DOCUMENTS_URL}`,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Document'],
    }),

    // Update a document
    updateDocument: builder.mutation({
      query: (data) => ({
        url: `${DOCUMENTS_URL}/${data.documentId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Document'],
    }),

    // Delete a document
    deleteDocument: builder.mutation({
      query: (documentId) => ({
        url: `${DOCUMENTS_URL}/${documentId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Document'],
    }),

    // Download a document
    downloadDocument: builder.query({
      query: (documentId) => ({
        url: `${DOCUMENTS_URL}/${documentId}/download`,
        method: 'GET',
        credentials: 'include',
        responseType: 'blob', // Handle file download
      }),
      providesTags: (result, error, documentId) => [{ type: 'Document', id: documentId }],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUploadDocumentMutation,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useDownloadDocumentQuery,
} = documentsApiSlice;
