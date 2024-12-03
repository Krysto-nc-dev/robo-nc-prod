// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { FILLIALES_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const fillialesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all filliales
    getFilliales: builder.query({
      query: () => ({
        url: `${FILLIALES_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Filliale'],
      keepUnusedDataFor: 5,
    }),

    // Create a new filliale
    createFilliale: builder.mutation({
      query: (data) => ({
        url: `${FILLIALES_URL}`,
        method: 'POST',
        body: data,
        
        credentials: 'include',
      }),
      invalidatesTags: ['Filliale'],
    }),

    // Get a filliale by ID
    getFillialeById: builder.query({
      query: (fillialeId) => ({
        url: `${FILLIALES_URL}/${fillialeId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, fillialeId) => [{ type: 'Filliale', id: fillialeId }],
      keepUnusedDataFor: 5,
    }),

    // Update a filliale
    updateFilliale: builder.mutation({
      query: (data) => ({
        url: `${FILLIALES_URL}/${data.fillialeId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Filliale'],
    }),

    // Delete a filliale
    deleteFilliale: builder.mutation({
      query: (fillialeId) => ({
        url: `${FILLIALES_URL}/${fillialeId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Filliale'],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetFillialesQuery,
  useCreateFillialeMutation,
  useGetFillialeByIdQuery,
  useUpdateFillialeMutation,
  useDeleteFillialeMutation,
} = fillialesApiSlice;
