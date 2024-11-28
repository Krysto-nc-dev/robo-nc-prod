// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { ZONES_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const zonesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all zones
    getZones: builder.query({
      query: () => ({
        url: `${ZONES_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Zone'],
      keepUnusedDataFor: 5,
    }),

    // Create a new zone with auto-generated barcodes and default statuses
    createZone: builder.mutation({
      query: (data) => ({
        url: `${ZONES_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Zone'],
    }),

    // Get a zone by ID
    getZoneById: builder.query({
      query: (zoneId) => ({
        url: `${ZONES_URL}/${zoneId}`,
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    // Update a zone and its parts
    updateZone: builder.mutation({
      query: (data) => ({
        url: `${ZONES_URL}/${data.zoneId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Zone'],
    }),

    // Delete a zone
    deleteZone: builder.mutation({
      query: (zoneId) => ({
        url: `${ZONES_URL}/${zoneId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Zone'],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetZonesQuery,
  useCreateZoneMutation,
  useGetZoneByIdQuery,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = zonesApiSlice;
