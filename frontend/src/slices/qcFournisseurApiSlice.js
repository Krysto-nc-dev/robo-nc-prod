// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { FOURNISSEURS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const fournisseurApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all fournisseurs
    getFournisseurs: builder.query({
      query: () => ({
        url: `${FOURNISSEURS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Fournisseur'],
      keepUnusedDataFor: 5,
    }),

    // Get a fournisseur by ID
    getFournisseurById: builder.query({
      query: (id) => ({
        url: `${FOURNISSEURS_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, id) => [{ type: 'Fournisseur', id }],
      keepUnusedDataFor: 5,
    }),
  }),
});

// Export the generated hooks
export const {
  useGetFournisseursQuery,
  useGetFournisseurByIdQuery,
} = fournisseurApiSlice;
